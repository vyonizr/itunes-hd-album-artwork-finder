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

Mirrors the existing `useAlbumSearch` pattern. Takes a `collectionId`, calls `/api/motion-artwork` on mount, and exposes the resulting `motionUrl` (or `null`).

### `CardAlbum` change

Each card calls `useMotionArtwork(collectionId)` independently. When `motionUrl` is present, render `<video autoPlay muted loop playsInline src={motionUrl} />` in place of the static `<img>`. When absent (the common case), render exactly what the card renders today — no visual difference, no loading state exposed to the user.

The existing artwork download button is unaffected and continues to download the static image only. Apple's motion art is served as an HLS stream (`.m3u8`), not a single downloadable file, and we are explicitly not adding server-side transcoding for this — motion art is view-only, in-card playback.

## Error handling

Every failure mode in the motion-artwork path (harvest failure, network error, 401/403 after retry, 404, malformed JSON, missing `editorialVideo`) resolves to `motionUrl: null` and the card falls back to the static artwork it already fetches via the existing search flow. The motion-artwork lookup is purely additive; it can never block or break the existing search/display flow.

## Risk

This depends on undocumented internals of Apple's web player (an embedded token intended for Apple's own frontend, and an undocumented private API). It can break without notice if Apple reshapes its JS bundle, rotates how the token is embedded, or adds bot detection — there is no SLA. It also operates in a legal/ToS gray area since it impersonates Apple's own web client against a private endpoint. Treat this as a best-effort visual enhancement, not a feature users can depend on.

Documented in `README.md` ("Legal disclaimer" section) and in the site footer, both crediting m8tec/apple-music-animated-artworks as the source of the technique.

## Testing

No test suite exists in this repo currently (per `CLAUDE.md`). Manual verification: search for an album known to have Motion Artwork on Apple Music (e.g. a recent high-profile release), confirm the card plays a looping video; search for an arbitrary older album, confirm it falls back to static artwork with no visible difference from current behavior; simulate a harvest/catalog failure (e.g. by breaking the regex temporarily) and confirm the app still functions normally with static-only artwork.
