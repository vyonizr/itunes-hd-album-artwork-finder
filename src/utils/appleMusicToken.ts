const BUNDLE_SRC_REGEX = /<script[^>]+src="(\/assets\/index[^"]+\.js)"/
const TOKEN_REGEX = /"(eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)"/

let cachedToken: string | null = null

async function harvestToken(): Promise<string> {
  const homepageResponse = await fetch('https://music.apple.com')
  const homepageHtml = await homepageResponse.text()

  const bundleMatch = homepageHtml.match(BUNDLE_SRC_REGEX)
  if (!bundleMatch) {
    throw new Error('Could not locate Apple Music web bundle script')
  }

  const bundleUrl = `https://music.apple.com${bundleMatch[1]}`
  const bundleResponse = await fetch(bundleUrl)
  const bundleJs = await bundleResponse.text()

  const tokenMatch = bundleJs.match(TOKEN_REGEX)
  if (!tokenMatch) {
    throw new Error('Could not locate bearer token in Apple Music bundle')
  }

  return tokenMatch[1]
}

export async function getAppleMusicToken(forceRefresh = false): Promise<string> {
  if (!cachedToken || forceRefresh) {
    cachedToken = await harvestToken()
  }
  return cachedToken
}
