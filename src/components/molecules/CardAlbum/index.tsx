import React, { memo } from 'react'
import MediaQuery from 'react-responsive'
import { ITunesAlbum } from 'src/types'
import Anchor from 'src/components/atoms/Anchor'
import ButtonBase from 'src/components/atoms/Button/ButtonBase'
import {
  Container,
  ContainerMobile,
  ContainerTablet,
  AlbumDetail,
  DownloadButtonContainer
} from './style'
import breakpoints from 'src/utils/breakpoints'

type Props = {
  album: ITunesAlbum
}

const CardAlbum = memo(({ album }: Props) => (
  <Container>
    <MediaQuery minDeviceWidth={breakpoints.mobile.min} maxDeviceWidth={breakpoints.mobile.max}>
      <ContainerMobile>
        <div>
          <Anchor href={album.artworkUrl600}>
            <img src={album.artworkUrl100} alt={`album artwork of ${album.collectionName} by ${album.artistName}`} />
          </Anchor>
        </div>
        <div>
          <AlbumDetail>
            <span><strong>{album.artistName} - {album.collectionName} [{album.year}]</strong></span>
          </AlbumDetail>
          <DownloadButtonContainer>
            <Anchor href={album.artworkUrl600}><ButtonBase><strong>SD</strong></ButtonBase></Anchor><Anchor href={album.artworkUrl}><ButtonBase><strong>HD</strong></ButtonBase></Anchor>
          </DownloadButtonContainer>
        </div>
      </ContainerMobile>
    </MediaQuery>
    <MediaQuery minDeviceWidth={breakpoints.tablet.min}>
      <ContainerTablet>
        <div>
          <Anchor href={album.artworkUrl600}>
            <img src={album.artworkUrl200} alt={`album artwork of ${album.collectionName} by ${album.artistName}`} />
          </Anchor>
        </div>
        <div>
          <AlbumDetail>
            <span><strong>{album.artistName} - {album.collectionName} [{album.year}]</strong></span>
          </AlbumDetail>
          <DownloadButtonContainer>
            <Anchor href={album.artworkUrl600}><ButtonBase><strong>SD</strong></ButtonBase></Anchor><Anchor href={album.artworkUrl}><ButtonBase><strong>HD</strong></ButtonBase></Anchor>
          </DownloadButtonContainer>
        </div>
      </ContainerTablet>
    </MediaQuery>
  </Container>
))

export default CardAlbum