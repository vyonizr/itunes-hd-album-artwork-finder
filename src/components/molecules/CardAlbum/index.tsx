import React, { memo, useEffect, useRef, useState } from 'react'
import Hls from 'hls.js'
import breakpoints from 'src/utils/breakpoints'

import { ITunesAlbum } from 'src/types'
import Anchor from 'src/components/atoms/Anchor'
import ButtonBase from 'src/components/atoms/Button/ButtonBase'
import { useWindowSize, useInView, useMotionArtwork } from 'src/hooks'
import { downloadMotionArtwork } from 'src/utils/downloadMotionArtwork'

import {
  Container,
  AlbumTitle,
  DownloadButtonContainer,
  DownloadButtonWrapper,
  HDText,
} from './style'

type Props = {
  album: ITunesAlbum
}

const CardAlbum = memo(({ album }: Props) => {
  const { width = 0 } = useWindowSize()
  const { ref, isInView, hasBeenInView } = useInView<HTMLDivElement>()
  const motionUrl = useMotionArtwork(album.collectionId, hasBeenInView)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isDownloadingMotion, setIsDownloadingMotion] = useState(false)
  const [motionFailed, setMotionFailed] = useState(false)

  const artworkSize = width < breakpoints.tablet.min ? 100 : 200
  const imageSrc =
    width < breakpoints.tablet.min ? album.artworkUrl100 : album.artworkUrl200

  useEffect(() => {
    setMotionFailed(false)
  }, [motionUrl])

  useEffect(() => {
    const videoNode = videoRef.current
    if (!videoNode || !motionUrl || motionFailed) return

    let hls: Hls | null = null

    if (Hls.isSupported()) {
      // Checked first, and preferred whenever available: some Chromium
      // browsers return a false-positive "maybe" from canPlayType for
      // application/vnd.apple.mpegurl without actually being able to
      // decode HLS, which fails with MediaError code 4 at playback time.
      // Hls.isSupported() checks for real MediaSource Extensions support
      // instead of trusting that heuristic.
      hls = new Hls()
      hls.loadSource(motionUrl)
      hls.attachMedia(videoNode)
    } else if (videoNode.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari intentionally has no MediaSource-based HLS, so
      // Hls.isSupported() is false there and this native path is used.
      videoNode.src = motionUrl
    }

    return () => {
      hls?.destroy()
    }
  }, [motionUrl])

  useEffect(() => {
    const videoNode = videoRef.current
    if (!videoNode || motionFailed) return

    if (isInView) {
      // iOS Safari blocks autoplay of any video whose `muted` IDL property
      // isn't actually true at play() time. React doesn't reliably sync
      // that property from the JSX `muted` attribute on hydration, so it's
      // set explicitly here - without it, play() rejects silently and the
      // video renders as a blank rectangle instead of falling back.
      videoNode.muted = true
      videoNode.play().catch(() => setMotionFailed(true))
    } else {
      videoNode.pause()
    }
  }, [isInView, motionUrl, motionFailed])

  const handleMotionDownload = async () => {
    if (!motionUrl || isDownloadingMotion) return

    setIsDownloadingMotion(true)
    try {
      await downloadMotionArtwork(
        motionUrl,
        `${album.artistName} - ${album.collectionName} (Motion).mp4`
      )
    } catch (error) {
      console.log(error)
    } finally {
      setIsDownloadingMotion(false)
    }
  }

  return (
    <Container ref={ref}>
      <Anchor href={album.artworkUrl600}>
        {motionUrl && !motionFailed ? (
          <video
            ref={videoRef}
            width={artworkSize}
            height={artworkSize}
            muted
            loop
            playsInline
            onError={() => {
              console.error(
                '[motion-artwork] video element error',
                videoRef.current?.error
              )
              setMotionFailed(true)
            }}
          />
        ) : (
          <img
            src={imageSrc}
            alt={`album artwork of ${album.collectionName} by ${album.artistName}`}
          />
        )}
      </Anchor>
      <div>
        <AlbumTitle>
          <span>
            <strong>
              {album.artistName} - {album.collectionName} [{album.year}]
            </strong>
          </span>
        </AlbumTitle>
        <DownloadButtonContainer>
          <DownloadButtonWrapper>
            <Anchor href={album.artworkUrl600}>
              <ButtonBase>
                <strong>SD</strong>
              </ButtonBase>
            </Anchor>
            <Anchor href={album.artworkUrl}>
              <ButtonBase primary>
                <strong>
                  <HDText>HD</HDText>
                </strong>
              </ButtonBase>
            </Anchor>
            {motionUrl && width >= breakpoints.tablet.max && (
              <ButtonBase onClick={handleMotionDownload}>
                <strong>{isDownloadingMotion ? '...' : 'Motion'}</strong>
              </ButtonBase>
            )}
          </DownloadButtonWrapper>
        </DownloadButtonContainer>
      </div>
    </Container>
  )
})

export default CardAlbum
