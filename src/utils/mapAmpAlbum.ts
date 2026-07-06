import { ITunesAlbum } from 'src/types'

export type AmpAlbumItem = {
  id: string
  attributes: {
    artistName: string
    name: string
    artwork: {
      url: string
    }
    releaseDate: string
  }
}

export function mapAmpAlbumToITunesAlbum(item: AmpAlbumItem): ITunesAlbum {
  const buildArtworkUrl = (size: string) =>
    item.attributes.artwork.url.replace('{w}x{h}', size)

  return {
    collectionId: Number(item.id),
    artistName: item.attributes.artistName,
    collectionName: item.attributes.name,
    releaseDate: item.attributes.releaseDate,
    year: new Date(item.attributes.releaseDate).getFullYear(),
    artworkUrl60: buildArtworkUrl('60x60'),
    artworkUrl100: buildArtworkUrl('100x100'),
    artworkUrl200: '',
    artworkUrl600: '',
    artworkUrl: '',
  }
}
