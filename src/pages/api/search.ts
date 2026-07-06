import Cors from 'cors'
import type { NextApiRequest, NextApiResponse } from 'next'

import { ITunesAlbumFetch } from 'src/types'
import initMiddleware from 'src/utils/initMiddleware'
import getCountryCode, { FALLBACK_COUNTRY } from 'src/utils/getCountryCode'
import { getAppleMusicToken } from 'src/utils/appleMusicToken'
import { mapAmpAlbumToITunesAlbum, AmpAlbumItem } from 'src/utils/mapAmpAlbum'
import { getClientIp, isRateLimited } from 'src/utils/rateLimit'

const cors = initMiddleware(
  Cors({
    methods: ['GET'],
  })
)

async function fetchAmpSearch(
  encodedKeyword: string,
  storefront: string,
  token: string
) {
  return fetch(
    `https://amp-api.music.apple.com/v1/catalog/${storefront}/search?term=${encodedKeyword}&types=albums&limit=25`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Origin: 'https://music.apple.com',
      },
    }
  )
}

async function runAmpSearch(
  encodedKeyword: string,
  storefront: string
): Promise<ITunesAlbumFetch> {
  let token = await getAppleMusicToken()
  let response = await fetchAmpSearch(encodedKeyword, storefront, token)

  if (response.status === 401 || response.status === 403) {
    token = await getAppleMusicToken(true)
    response = await fetchAmpSearch(encodedKeyword, storefront, token)
  }

  if (!response.ok) {
    throw new Error(`AMP search failed with status ${response.status}`)
  }

  const json = await response.json()
  const items: AmpAlbumItem[] = json?.results?.albums?.data ?? []
  const results = items.map(mapAmpAlbumToITunesAlbum)

  return { resultCount: results.length, results }
}

async function searchViaAmp(
  encodedKeyword: string,
  storefront: string
): Promise<ITunesAlbumFetch> {
  const primaryResult = await runAmpSearch(encodedKeyword, storefront)

  const fallbackStorefront = FALLBACK_COUNTRY.toLowerCase()
  if (primaryResult.resultCount === 0 && storefront !== fallbackStorefront) {
    return runAmpSearch(encodedKeyword, fallbackStorefront)
  }

  return primaryResult
}

async function searchViaLegacy(
  encodedKeyword: string,
  country: string
): Promise<ITunesAlbumFetch> {
  const baseURL = 'https://itunes.apple.com/search'
  const searchURL = (countryCode: string) =>
    `${baseURL}?term=${encodedKeyword}&entity=album&country=${countryCode}`

  const response = await fetch(searchURL(country))
  let responseJSON: ITunesAlbumFetch = await response.json()

  if (responseJSON.resultCount === 0 && country !== FALLBACK_COUNTRY) {
    const fallbackResponse = await fetch(searchURL(FALLBACK_COUNTRY))
    responseJSON = await fallbackResponse.json()
  }

  return responseJSON
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const keyword: string = req.query.keyword as string
  const encodedKeyword = encodeURIComponent(keyword)
  const country = getCountryCode(req)

  try {
    await cors(req, res)

    if (await isRateLimited('search', getClientIp(req))) {
      res.status(429).json({ resultCount: 0, results: [] })
      return
    }

    if (keyword.length === 0) {
      res.json({ resultCount: 0, results: [] })
      return
    }

    let responseJSON: ITunesAlbumFetch

    try {
      responseJSON = await searchViaAmp(encodedKeyword, country.toLowerCase())
    } catch (ampError) {
      responseJSON = await searchViaLegacy(encodedKeyword, country)
    }

    res.json(responseJSON)
  } catch (error) {
    if (error) {
      res.json(error)
    }
  }
}
