import Cors from 'cors'
import type { NextApiRequest, NextApiResponse } from 'next'

import initMiddleware from 'src/utils/initMiddleware'

const cors = initMiddleware(
  Cors({
    methods: ['GET'],
  })
)

type TrendingEntry = {
  artist: string
  album: string
}

type TrendingResponse = {
  entries: TrendingEntry[]
  updated: string
}

interface RSSEntry {
  'im:name': { label: string }
  'im:artist': { label: string }
  'im:image': { label: string }[]
}

let cache: { data: TrendingResponse; timestamp: number } | null = null
const CACHE_TTL = 60 * 60 * 1000

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  await cors(_req, res)

  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return res.json(cache.data)
  }

  try {
    const feedURL =
      'https://itunes.apple.com/us/rss/topalbums/limit=20/json'
    const response = await fetch(feedURL)
    const json = await response.json()

    const entries: TrendingEntry[] = json.feed.entry
      .filter((entry: RSSEntry) => entry['im:artist']?.label && entry['im:name']?.label)
      .map((entry: RSSEntry) => ({
        artist: entry['im:artist'].label,
        album: entry['im:name'].label,
      }))

    const data: TrendingResponse = {
      entries,
      updated: new Date().toISOString(),
    }

    cache = { data, timestamp: Date.now() }

    res.json(data)
  } catch (error) {
    if (cache) {
      return res.json(cache.data)
    }
    res.status(502).json({ error: 'Failed to fetch trending albums' })
  }
}
