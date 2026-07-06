# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A Next.js (pages router) app that lets users search for albums and download high-resolution (and, where available, animated "Motion Artwork") artwork. It is not affiliated with Apple; see the README's legal disclaimer. Static artwork comes from Apple's public iTunes Search/AMP catalog APIs; animated artwork comes from an unofficial technique that harvests a bearer token out of Apple's own `music.apple.com` web player bundle (see `docs/superpowers/specs/2026-07-06-animated-album-artwork-design.md` for the full design rationale and risk tradeoffs).

## Commands

- `yarn dev`: start dev server (binds `0.0.0.0`, see `next dev -H 0.0.0.0` in `package.json`)
- `yarn build`: production build
- `yarn start`: run production build
- `yarn test`: run the Vitest suite (`vitest run`)
- `yarn vitest run src/utils/mapAmpAlbum.test.ts`: run a single test file
- No lint script is configured.

Package manager is Yarn (Berry, via `.yarnrc.yml`/`.yarn/`); use `yarn`, not `npm`.

## Architecture

**Static-artwork search flow**: `src/pages/index.tsx` → `SearchForm` submits a query → `useAlbumSearch` hook (`src/hooks/useAlbumSearch.ts`) calls `/api/search` → `src/pages/api/search.ts`.

`api/search.ts` tries two backends in order:
1. **AMP (Apple Music Private API)** via `searchViaAmp`/`runAmpSearch`, calls `amp-api.music.apple.com` using a bearer token from `src/utils/appleMusicToken.ts` (harvested by scraping `music.apple.com`'s web bundle; cached module-level, re-harvested once on a 401/403). Results are normalized to the app's shape by `src/utils/mapAmpAlbum.ts`. If the primary storefront returns zero results, it retries against the fallback storefront (`FALLBACK_COUNTRY` = `US`, from `src/utils/getCountryCode.ts`).
2. **Legacy iTunes Search API** (`searchViaLegacy`, `itunes.apple.com/search`): used only if the AMP path throws. Same per-country fallback behavior.

The AMP path exists not just for search but because it returns the `collectionId` shape the motion-artwork lookup needs; the legacy path is the always-available fallback of last resort.

**Artwork URL upsizing**: both backends only give a base artwork URL/60x60 thumbnail. `useAlbumSearch` derives higher-res variants client-side by string-replacing the `60x60bb.jpg` suffix (e.g. `200x200bb.jpg`, `600x600bb.jpg`, `3000x3000bb-100.jpg`). This is the core trick of the app: if artwork isn't loading at the expected size, check this replacement logic first.

**Motion (animated) artwork flow**: `CardAlbum` uses `useInView` (IntersectionObserver) to detect when a card first becomes visible, then calls `useMotionArtwork(collectionId, hasBeenInView)` → `/api/motion-artwork` → `src/pages/api/motion-artwork.ts`, which calls the AMP catalog endpoint (same bearer-token mechanism as search) for `editorialVideo.motionDetailSquare/Tall`. Every failure mode (harvest failure, 401/403 after one retry, 404, missing field) resolves to `{ motionUrl: null }`; the card silently falls back to the static `<img>`. When a motion URL is present, playback is driven by intersection state (`video.play()`/`.pause()`), not the `autoplay` attribute, and a rejected `play()` due to platform autoplay blocking is retried once on the user's next `touchend`. HLS playback prefers `hls.js` (`Hls.isSupported()`) over the browser's native `canPlayType`, because some Chromium browsers report native HLS support without being able to actually decode it.

**Motion artwork download**: `src/utils/downloadMotionArtwork.ts` + `src/utils/hlsPlaylist.ts` hand-parse the HLS `.m3u8` playlist (resolving through `#EXT-X-STREAM-INF` variants to a media playlist, extracting the `#EXT-X-MAP` init segment and TS/fMP4 segment URLs). If all resolved URLs collapse to one shared already-complete file (checked via contiguous BYTERANGE offsets), it's fetched directly with no remux. Otherwise `@ffmpeg/ffmpeg` (ffmpeg.wasm, loaded lazily only on download click) concatenates/remuxes segments into a playable `.mp4`.

**Component structure** follows atomic design:
- `src/components/atoms/`: `Button`, `Input`, `Anchor` primitives, each with `index.tsx` + `style.ts` (styled-components)
- `src/components/molecules/`: `SearchForm`, `CardAlbum`, `Footer` (composed from atoms)

**Styling**: styled-components with a theme (`src/styles/theme.ts`, typed via `src/styles/styled.d.ts`). Breakpoints/px helpers live in `src/utils/`. The styled-components Babel/SWC transform is enabled in `next.config.js`.

**Types**: `src/types/index.ts` defines `ITunesAlbum`/`ITunesAlbumFetch` (the app's normalized album shape, common to both search backends, extended with derived artwork URL fields and a `year` field), `MotionArtworkResponse`, and `Breakpoints`.

**Path aliasing**: imports use `src/...` absolute paths (configured via `tsconfig.json` `baseUrl: "."`), not relative paths; follow this convention in new code.

**Testing**: Vitest is configured (`yarn test`) but coverage is minimal: currently only `src/utils/mapAmpAlbum.test.ts`, which pins the AMP→ITunesAlbum mapping against a captured real API response. There is no test runner config file beyond `package.json`'s script; add new tests as `*.test.ts` alongside the module under test.
