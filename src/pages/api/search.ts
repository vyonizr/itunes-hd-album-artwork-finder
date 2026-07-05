import Cors from 'cors'
import type { NextApiRequest, NextApiResponse } from 'next'

import { ITunesAlbumFetch } from 'src/types'
import initMiddleware from 'src/utils/initMiddleware'
import getCountryCode from 'src/utils/getCountryCode'

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
  const targetURL = `${baseURL}?term=${encodedKeyword}&entity=album&country=${country}`

  try {
    await cors(req, res)

    if (keyword.length > 0) {
      const response = await fetch(targetURL)
      const responseJSON: ITunesAlbumFetch = await response.json()
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
