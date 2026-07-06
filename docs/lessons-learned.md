# Lessons Learned: iTunes HD Album Artwork Finder

Notes for understanding *why* this app is built the way it is, not just what
the code does. Read alongside `CLAUDE.md` (architecture map) and
`docs/superpowers/specs/2026-07-06-animated-album-artwork-design.md` (the
motion-artwork feature's original design doc).

## The core problem: undersized artwork

The public iTunes Search API (`itunes.apple.com/search`) only ever returns a
60x60 thumbnail (`artworkUrl60`). There's no "give me the full-res version"
parameter. The trick the whole app is built around: Apple's CDN serves the
same artwork at multiple resolutions if you edit the filename suffix
(`60x60bb.jpg` → `600x600bb.jpg`, `3000x3000bb-100.jpg`, ...). This is a
string replace, not an API feature. `src/hooks/useAlbumSearch.ts` derives
`artworkUrl200/600/artworkUrl` client-side after the search response comes
back. If artwork stops loading at a given size, this is the first place to
check, not the API layer.

**Lesson**: sometimes the "API" for a feature is really "an undocumented
convention in a URL string." It's fragile (Apple could change filename
conventions with no warning) but there's no alternative without an
Apple Developer account.

## Two search backends, not one

`src/pages/api/search.ts` tries `searchViaAmp` first and falls back to
`searchViaLegacy` (the plain iTunes Search API) on any error. This looks
redundant until you know why: the AMP (Apple Music Private API) path exists
*only* to get a `collectionId` shape that the motion-artwork lookup can use,
and to get better/more consistent metadata. The legacy iTunes API is the
fallback of last resort: always available, no auth, but capped at low-res
artwork field semantics.

**Lesson**: when a codebase has two implementations of "the same" operation,
look for the *secondary reason* the newer one exists (here: motion artwork
needs AMP's catalog shape) before assuming it's dead code or an incomplete
migration.

## Borrowing a private API without a developer account

Motion Artwork (looping video album art) is only exposed through Apple's
official MusicKit Catalog API, which needs a paid Developer Program
membership + signed JWT. `src/utils/appleMusicToken.ts` sidesteps this by
scraping Apple's own web player:

1. Fetch `music.apple.com`, regex out the `<script src="/assets/index*.js">`
   bundle URL.
2. Fetch that bundle, regex out an embedded JWT (`eyJ...`): this is the
   anonymous bearer token Apple's own frontend uses to call
   `amp-api.music.apple.com`.
3. Cache it in a module-level variable; re-harvest only on a 401/403 (see
   `getAppleMusicToken(forceRefresh)` and the retry-once pattern in both
   `search.ts` and `motion-artwork.ts`).

**Lesson**: "no official API for X" doesn't always mean X is impossible.
If a company's own web app does X in the browser, the browser had to get
some kind of credential to do it too. The tradeoff is durability: this
breaks the moment Apple changes its bundle naming, token embedding, or adds
bot detection, and every failure path in `motion-artwork.ts` is designed to
degrade silently to `motionUrl: null` rather than surface an error, because
this dependency has no SLA.

## Motion artwork is a video stream, not a file

Once you have a motion-artwork URL, it's an HLS playlist (`.m3u8`), not an
MP4. `src/utils/hlsPlaylist.ts` hand-parses the manifest:

- `resolveMediaPlaylist` recurses through `#EXT-X-STREAM-INF` variant
  playlists (a "master" playlist listing several quality variants) until it
  reaches an actual media playlist with segment URLs; line-count heuristics
  don't reliably distinguish master from media playlists, so it specifically
  looks for that tag.
- `parseM3U8` extracts the `#EXT-X-MAP` init segment (fragmented MP4 header)
  and the list of segment URLs, resolving each against the playlist's own
  URL since HLS lines are often relative.

Downloading (`src/utils/downloadMotionArtwork.ts`) special-cases the common
case: Apple serves these as HTTP byte-range requests into one shared,
already-complete fragmented MP4 (confirmed by checking that BYTERANGE
offsets are contiguous from 0). When that holds, it just fetches the single
underlying URL directly: no remuxing needed. Only when segments are
genuinely separate files does it fall back to `ffmpeg.wasm` to concat/remux
them into a playable `.mp4`.

**Lesson**: don't reach for a heavy tool (ffmpeg.wasm, ~25-30MB) before
checking whether the "hard" case is actually the common case. The cheap
path (single URL, direct fetch) covers real-world Apple playlists; ffmpeg is
the fallback, loaded lazily only on click so it never costs anything for
users who never download motion art.

## Playback is gated by viewport, not autoplay

A search result page can have up to 50 cards. `CardAlbum` doesn't fetch or
play motion artwork on mount; `useInView` (`IntersectionObserver`) tracks
visibility, and `useMotionArtwork(collectionId, hasBeenInView)` only fires
its fetch the first time a card scrolls into view. Playback itself follows
current intersection state (`video.play()`/`.pause()` in an effect), not the
`autoplay` HTML attribute; this is what lets a card resume playing on
scroll-back without re-fetching.

There's also a specific autoplay-rejection workaround: browsers can reject
`video.play()` with `NotAllowedError` (Low Power Mode, data saver, autoplay
settings). Rather than giving up, the code retries once on the user's next
`touchend` anywhere on the page; a real user gesture always overrides
platform autoplay blocks, so this converts a permanent failure into a
one-tap delay.

**Lesson**: gate expensive-per-item work (network fetch, video decode) on
actual visibility, not mount. And browser autoplay rejection isn't always
final; a real gesture upgrades the permission, so it's worth listening for
one instead of failing over to a static image immediately.

## Browser HLS support is inconsistent, and can lie

`CardAlbum` checks `Hls.isSupported()` (hls.js's real MediaSource Extensions
check) before falling back to a browser's native
`canPlayType('application/vnd.apple.mpegurl')`. The ordering is deliberate:
some Chromium browsers return a false-positive "maybe" from `canPlayType`
for HLS without actually being able to decode it, which fails at playback
time with a generic `MediaError`. Safari has no MediaSource-based HLS path
(so `Hls.isSupported()` is correctly `false` there) and needs the native
`<video src>` path instead.

**Lesson**: browser feature-detection APIs can be technically-true but
practically-false. Prefer a check tied to the actual mechanism you depend on
(MSE support) over a generic capability query, and validate that ordering
against real device/browser combos, not just spec reading.

## Small defensive choices worth knowing about

- **Country/storefront input**: `getCountryCode` only trusts
  `x-vercel-ip-country` (a platform-set header, not user input) and
  validates it against `/^[A-Za-z]{2}$/` before using it in any outbound URL,
  falling back to `US` otherwise. Search keywords are run through
  `encodeURIComponent` server-side before being placed in fetch URLs.
- **Trending endpoint caching**: `src/pages/api/trending.ts` keeps an
  in-memory `Map` cache per country with a 1-hour TTL, and serves the stale
  cached copy on upstream fetch failure rather than erroring; a good
  default for "nice-to-have" data that doesn't need to be fresh every
  request.
- **Thin automated test coverage**: `yarn test` runs Vitest, but the only
  spec today (`src/utils/mapAmpAlbum.test.ts`) pins the AMP→`ITunesAlbum`
  mapping against a captured real API response; it guards the "shape of
  Apple's response changed" failure mode specifically, not the app broadly.
  Everything else (AMP/legacy fallback switching, token harvesting, HLS
  parsing, motion-artwork gating) is still only covered by the manual
  verification checklist in the motion-artwork design doc (search a
  known-motion-art album, search an old album for fallback, simulate a
  harvest failure, confirm download produces a playable file); worth
  running through by hand after touching any of those code paths.

## Where this is fragile (by design, not by accident)

Everything under "borrowing a private API" and "motion artwork is a video
stream" depends on Apple's internal web player internals staying roughly
stable. There's no SLA, no versioned contract, and it may not comply with
Apple's ToS (see README's legal disclaimer). The app is architected so that
*every* failure in that path (harvest failure, 401/403 after one retry,
malformed response, missing `editorialVideo`) degrades to the plain static
artwork flow that only depends on the public, documented iTunes Search API.
That fallback discipline (never let the risky path take down the reliable
one) is the main structural lesson to carry into other "unofficial API"
integrations.
