import React, { memo } from 'react'
import { ITunesAlbum } from 'src/types'
import { Container } from './style'

type Props = {
  album: ITunesAlbum
}

const CardAlbum = memo(({ album }: Props) => (
  <Container>
    <div>
      <a href={album.artworkUrl600} target="_blank" rel="noopener noreferrer">
        <img src={album.artworkUrl100} alt={`album artwork of ${album.collectionName} by ${album.artistName}`} />
      </a>
    </div>
    <div>
      <div>
        <span><strong>{album.artistName} - {album.collectionName} [{album.year}]</strong></span>
      </div>
      <div>
        <span><a href={album.artworkUrl600} target="_blank" rel="noopener noreferrer">SD</a> | <a href={album.artworkUrl} target="_blank" rel="noopener noreferrer">HD</a></span>
      </div>
    </div>
  </Container>
))

export default CardAlbum