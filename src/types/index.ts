export type ITunesAlbumFetch = {
  resultCount: number
  results: ITunesAlbum[]
}

export type ITunesAlbum = {
  collectionId: number
  artistName: string
  collectionName: string
  releaseDate: string
  year: number
  artworkUrl60: string
  artworkUrl100: string
  artworkUrl200: string
  artworkUrl600: string
  artworkUrl: string
}

export type MotionArtworkResponse = {
  motionUrl: string | null
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
