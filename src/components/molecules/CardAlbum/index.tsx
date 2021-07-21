import React, { memo } from 'react'
import breakpoints from 'src/utils/breakpoints'

import { ITunesAlbum } from 'src/types'
import Anchor from 'src/components/atoms/Anchor'
import ButtonBase from 'src/components/atoms/Button/ButtonBase'
import { useWindowSize } from 'src/hooks'

import {
  Container,
  AlbumTitle,
  DownloadButtonContainer,
  DownloadButtonWrapper,
} from './style'

type Props = {
  album: ITunesAlbum
}

const CardAlbum = memo(({ album }: Props) => {
  const handleImageRes = (album: ITunesAlbum): string => {
    const { width = 0 } = useWindowSize()

    return width < breakpoints.tablet.min
      ? album.artworkUrl100
      : album.artworkUrl200
  }

  return (
    <Container>
      <Anchor href={album.artworkUrl600}>
        <img
          src={handleImageRes(album)}
          alt={`album artwork of ${album.collectionName} by ${album.artistName}`}
        />
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
                  <i>HD</i>
                </strong>
              </ButtonBase>
            </Anchor>
          </DownloadButtonWrapper>
        </DownloadButtonContainer>
      </div>
    </Container>
  )
})

export default CardAlbum
