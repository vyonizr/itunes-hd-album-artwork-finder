import type { NextApiRequest, NextApiResponse } from 'next'

import { getAppleMusicToken } from 'src/utils/appleMusicToken'
import getCountryCode from 'src/utils/getCountryCode'
import { MotionArtworkResponse } from 'src/types'

async function fetchCatalogAlbum(
  collectionId: string,
  storefront: string,
  token: string
) {
  return fetch(
    `https://amp-api.music.apple.com/v1/catalog/${storefront}/albums/${collectionId}?extend=editorialVideo&platform=web`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Origin: 'https://music.apple.com',
      },
    }
  )
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MotionArtworkResponse>
) {
  const collectionId = req.query.collectionId as string

  if (!collectionId) {
    res.status(400).json({ motionUrl: null })
    return
  }

  const storefront = getCountryCode(req).toLowerCase()

  try {
    let token = await getAppleMusicToken()
    let response = await fetchCatalogAlbum(collectionId, storefront, token)

    if (response.status === 401 || response.status === 403) {
      token = await getAppleMusicToken(true)
      response = await fetchCatalogAlbum(collectionId, storefront, token)
    }

    if (!response.ok) {
      res.json({ motionUrl: null })
      return
    }

    const json = await response.json()
    const editorialVideo = json?.data?.[0]?.attributes?.editorialVideo
    const motionUrl =
      editorialVideo?.motionDetailSquare?.video ??
      editorialVideo?.motionDetailTall?.video ??
      null

    res.json({ motionUrl })
  } catch (error) {
    res.json({ motionUrl: null })
  }
}
