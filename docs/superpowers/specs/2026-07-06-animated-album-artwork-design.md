# Animated Album Artwork — Design

## Problem

Apple Music has "Motion Artwork" — a short looping video in place of static album art — for some albums. This app currently only fetches static artwork from the iTunes Search API (`artworkUrl60`, upsized by string replacement in `useAlbumSearch`). We want to show the animated version, when one exists, alongside the existing static-artwork flow.

## Feasibility summary

- The public iTunes Search API this app uses has no animated-artwork field.
- Apple's official Music Catalog API (MusicKit) does expose it (`attributes.editorialVideo.motionDetailSquare/Tall.video`), but requires an Apple Developer Program membership ($99/yr) and signed JWT auth.
- Instead, we use the technique from [m8tec/apple-music-animated-artworks](https://github.com/m8tec/apple-music-animated-artworks): harvest the anonymous bearer token embedded in Apple's own `music.apple.com` web-player JS bundle, and use it to call the same private `amp-api.music.apple.com` endpoint the web player itself calls. No developer account needed. This is an independent reimplementation of their technique (their repo has no LICENSE, so no code is copied) — credited in the README and site footer.
- Coverage is partial: only albums Apple's editorial team produced motion art for. Everything else silently shows static artwork, as it does today.

## Architecture

### New API route: `src/pages/api/motion-artwork.ts`

Input: `collectionId` (the iTunes/Apple catalog album ID already returned by the existing `/api/search` route) and `country` (reuse the same storefront code `getCountryCode` already derives for the static-artwork search).

Steps:
1. **Token harvest** (cached): fetch `https://music.apple.com`, extract the linked JS bundle URL, fetch the bundle, regex out the embedded bearer JWT (`eyJ[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+`). Cache the token in a module-level variable — harvesting costs two HTTP round-trips, so do it once per server instance and reuse.
2. **Catalog call**: `GET https://amp-api.music.apple.com/v1/catalog/{country}/albums/{collectionId}?extend=editorialVideo&platform=web` with `Authorization: Bearer {token}` and `Origin: https://music.apple.com`.
3. On `401`/`403`: treat the cached token as stale, re-harvest once, retry the catalog call once. If it still fails, fall through to step 4 as if no motion art was found (no further retries).
4. Extract `attributes.editorialVideo.motionDetailSquare.video` from the response. Return `{ motionUrl }` if present, otherwise `{ motionUrl: null }` — this covers 404s, missing `editorialVideo`, and any request failure. There is no secondary name-based search fallback if the direct ID lookup misses.

### New hook: `src/hooks/useMotionArtwork.ts`

Mirrors the existing `useAlbumSearch` pattern. Takes a `collectionId` and a `shouldFetch` flag, calls `/api/motion-artwork` once `shouldFetch` first becomes true, and exposes the resulting `motionUrl` (or `null`).

### `CardAlbum` change — viewport-gated autoplay

A result set can have up to 50 cards, so we don't want dozens of concurrent video streams:

- Each card uses an `IntersectionObserver` (a small `useInView` ref hook) to track whether it's currently on-screen.
- `useMotionArtwork(collectionId, hasBeenVisible)` only fires its fetch the first time the card enters the viewport — cards that are never scrolled to never trigger a motion-artwork lookup at all, bounding backend load the same way it bounds playback.
- Once `motionUrl` is resolved, the card renders `<video muted loop playsInline src={motionUrl} />` in place of the static `<img>`, but playback itself is driven by the current intersection state: `video.play()` while in view, `video.pause()` when scrolled out (rather than a plain `autoPlay` attribute). This keeps only on-screen cards actively playing, and resumes automatically on scroll-back without re-fetching.
- When `motionUrl` is absent, or before first visibility, the card renders exactly what it does today — no visual difference, no loading state exposed to the user.

### Motion artwork download (client-side, ffmpeg.wasm)

Apple's motion art is served as an HLS stream (`.m3u8` + segments), not a single downloadable file. Rather than transcoding server-side (which would require bundling an ffmpeg binary into the serverless function), we follow m8tec's approach and do it entirely client-side:

- Add `@ffmpeg/ffmpeg` (ffmpeg.wasm) as a dependency, loaded lazily — only when a user clicks download on a card that has motion artwork, not on page load.
- On click: fetch the HLS playlist and its `.ts` segments, write them into ffmpeg.wasm's virtual filesystem, and run `-f concat -safe 0 -i list.txt -c copy output.mp4` (remux only, no re-encode — fast, no quality loss).
- `URL.createObjectURL` the resulting blob and trigger a normal browser download, same as the existing static-artwork download.
- Output format is `.mp4` only for now — no `.webp` option (YAGNI; add if requested later).
- The existing static-artwork `SD`/`HD` download buttons and their behavior are unchanged. When `motionUrl` is resolved, a third button (same `ButtonBase`, same `DownloadButtonWrapper` row, `CardAlbum/index.tsx:46-59`) is added alongside them for the animated download — cards without motion art keep showing only `SD`/`HD`, unchanged from today.
- The animated-download button is hidden below the existing `mobile` breakpoint (`src/utils/breakpoints.ts`, 0–480px) via a CSS media query on the button itself — same mechanism already used elsewhere in `CardAlbum/style.ts` for responsive layout, no JS user-agent sniffing needed. Motion artwork still autoplays in the card on mobile; only the download action is unavailable, avoiding the ~25-30MB wasm fetch and heavy CPU work on constrained devices/connections.

## Error handling

Every failure mode in the motion-artwork path (harvest failure, network error, 401/403 after retry, 404, malformed JSON, missing `editorialVideo`) resolves to `motionUrl: null` and the card falls back to the static artwork it already fetches via the existing search flow. The motion-artwork lookup is purely additive; it can never block or break the existing search/display flow.

## Risk

This depends on undocumented internals of Apple's web player (an embedded token intended for Apple's own frontend, and an undocumented private API). It can break without notice if Apple reshapes its JS bundle, rotates how the token is embedded, or adds bot detection — there is no SLA. It also operates in a legal/ToS gray area since it impersonates Apple's own web client against a private endpoint. Treat this as a best-effort visual enhancement, not a feature users can depend on.

ffmpeg.wasm is a ~25–30MB WebAssembly download and uses real client-side CPU for a few seconds per download. Loading it lazily (only on download click, not on page load) keeps this cost off the default browsing experience.

Documented in `README.md` ("Legal disclaimer" section) and in the site footer, both crediting m8tec/apple-music-animated-artworks as the source of the technique.

## Testing

No test suite exists in this repo currently (per `CLAUDE.md`). Manual verification: search for an album known to have Motion Artwork on Apple Music (e.g. a recent high-profile release), confirm the card plays a looping video; search for an arbitrary older album, confirm it falls back to static artwork with no visible difference from current behavior; simulate a harvest/catalog failure (e.g. by breaking the regex temporarily) and confirm the app still functions normally with static-only artwork; click download on a card with motion artwork and confirm a valid, playable `.mp4` is saved.
