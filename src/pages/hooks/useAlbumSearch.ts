import { useState } from 'react'
import { getAlbums } from '../api/getAlbums'
import { ITunesAlbumFetch, ITunesAlbum } from '../../types'

interface IUseAlbumSearch {
  albums: ITunesAlbum[]
  isError: boolean | null
  isLoading: boolean
  searchAlbums: (albumName: string) => void
}

export const useAlbumSearch = (): IUseAlbumSearch => {
  const initialAlbumsState: ITunesAlbumFetch = { resultCount: 0, results: [] }
  const [albums, setAlbums] = useState<ITunesAlbumFetch>(initialAlbumsState);
  const [isError, setIsError] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const searchAlbums = async (albumName: string) => {
    try {
      setIsLoading(true)
      const data = await getAlbums(albumName)
      data.results
        .map((album: ITunesAlbum ) => {
          album.artworkUrl600 = album.artworkUrl60.replace('60x60bb.jpg', '600x600bb.jpg')
          album.artworkUrl = album.artworkUrl60.replace('60x60bb.jpg', '100000x100000-999.jpg')
          const releaseDate = new Date(album.releaseDate)
          album.year = releaseDate.getFullYear()
          return album
        })
        .sort((a: ITunesAlbum, b: ITunesAlbum) => (new Date(b.releaseDate) > new Date(a.releaseDate) ? -1 : 1))
      setAlbums(data)
    } catch (error) {
      setIsError(error)
      setAlbums(initialAlbumsState)
    }
    finally {
      setIsLoading(false)
    }
  }

  return { albums: albums.results, isError, isLoading, searchAlbums }
}