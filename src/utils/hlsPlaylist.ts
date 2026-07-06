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

function findFirstVariantUrl(
  playlistText: string,
  playlistUrl: string
): string | null {
  // A master playlist lists one or more variants, each as a
  // #EXT-X-STREAM-INF tag immediately followed by that variant's own
  // playlist URL on the next line. Real Apple motion-artwork playlists
  // always have several variants (different resolutions/codecs), so we
  // can't tell master from media playlists by counting non-# lines -
  // we have to look for this specific tag.
  const lines = playlistText
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  const variantTagIndex = lines.findIndex((line) =>
    line.startsWith('#EXT-X-STREAM-INF')
  )
  if (variantTagIndex === -1) return null

  const variantUrlLine = lines[variantTagIndex + 1]
  if (!variantUrlLine || variantUrlLine.startsWith('#')) return null

  return resolveUrl(variantUrlLine, playlistUrl)
}

export async function resolveMediaPlaylist(
  playlistUrl: string
): Promise<ParsedPlaylist> {
  const response = await fetch(playlistUrl)
  const playlistText = await response.text()

  const firstVariantUrl = findFirstVariantUrl(playlistText, playlistUrl)
  if (firstVariantUrl) {
    return resolveMediaPlaylist(firstVariantUrl)
  }

  return parseM3U8(playlistText, playlistUrl)
}
