import Cors from 'cors'
import type { NextApiRequest, NextApiResponse } from 'next'

import { ITunesAlbumFetch } from 'src/types'
import initMiddleware from 'src/utils/initMiddleware'
import getCountryCode, { FALLBACK_COUNTRY } from 'src/utils/getCountryCode'

const cors = initMiddleware(
  Cors({
    methods: ['GET'],
  })
)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const keyword: string = req.query.keyword as string
  const encodedKeyword = encodeURIComponent(keyword)

  const country = getCountryCode(req)
  const baseURL: string = 'https://itunes.apple.com/search'
  const searchURL = (countryCode: string) =>
    `${baseURL}?term=${encodedKeyword}&entity=album&country=${countryCode}`

  try {
    await cors(req, res)

    if (keyword.length > 0) {
      const response = await fetch(searchURL(country))
      let responseJSON: ITunesAlbumFetch = await response.json()

      if (responseJSON.resultCount === 0 && country !== FALLBACK_COUNTRY) {
        const fallbackResponse = await fetch(searchURL(FALLBACK_COUNTRY))
        responseJSON = await fallbackResponse.json()
      }

      res.json(responseJSON)
    } else {
      res.json({ resultCount: 0, results: [] })
    }
  } catch (error) {
    if (error) {
      res.json(error)
    }
  }
}
