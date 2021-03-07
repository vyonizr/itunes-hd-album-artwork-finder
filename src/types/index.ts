export type ITunesAlbumFetch = {
  resultCount: number
  results: ITunesAlbum[]
}

export type ITunesAlbum = {
  amgArtistId: number
  artistId: string
  artistName: string
  artistViewUrl: string
  artworkUrl60: string
  artworkUrl100: string
  artworkUrl200: string
  artworkUrl600: string
  artworkUrl: string
  collectionCensoredName: string
  collectionExplicitness: string
  collectionId: number
  collectionName: string
  collectionPrice: number
  collectionType: string
  collectionViewUrl: string
  copyright: string
  country: string
  currency: string
  primaryGenreName: string
  releaseDate: string
  trackCount: number
  wrapperType: string
  year: number
}

export type Breakpoints = {
  mobile: {
    min: number
    max: number
  }
  tablet: {
    min: number
    max: number
  }
  laptop: {
    min: number
    max: number
  }
  desktop: {
    min: number
    max: number
  }
  tv: {
    min: number
    max: null
  }
}
