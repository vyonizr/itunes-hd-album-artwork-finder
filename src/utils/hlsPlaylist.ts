type ParsedPlaylist = {
  initSegmentUrl: string | null
  segmentUrls: string[]
}

function resolveUrl(possiblyRelativeUrl: string, baseUrl: string): string {
  return new URL(possiblyRelativeUrl, baseUrl).toString()
}

export function parseM3U8(
  playlistText: string,
  playlistUrl: string
): ParsedPlaylist {
  const lines = playlistText
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  const mapLine = lines.find((line) => line.startsWith('#EXT-X-MAP:'))
  const mapUriMatch = mapLine?.match(/URI="([^"]+)"/)
  const initSegmentUrl = mapUriMatch
    ? resolveUrl(mapUriMatch[1], playlistUrl)
    : null

  const segmentUrls = lines
    .filter((line) => !line.startsWith('#'))
    .map((line) => resolveUrl(line, playlistUrl))

  return { initSegmentUrl, segmentUrls }
}

export async function resolveMediaPlaylist(
  playlistUrl: string
): Promise<ParsedPlaylist> {
  const response = await fetch(playlistUrl)
  const playlistText = await response.text()
  const parsed = parseM3U8(playlistText, playlistUrl)

  const isMasterPlaylist =
    parsed.segmentUrls.length === 1 && parsed.segmentUrls[0].endsWith('.m3u8')

  if (isMasterPlaylist) {
    return resolveMediaPlaylist(parsed.segmentUrls[0])
  }

  return parsed
}
