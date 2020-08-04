import { ITunesAlbumFetch } from 'src/types'
import corsAnywhere from 'src/utils/corsAnywhere'

export const getAlbums = async (albumName: string): Promise<any> => {
  const baseURL: string = 'https://itunes.apple.com/search'
  const targetURL = `${corsAnywhere(baseURL)}?term=${albumName}&entity=album`

  try {
    if (albumName.length > 0) {
      const response = await fetch(targetURL)
      const responseJSON: ITunesAlbumFetch = await response.json()
      return responseJSON
    }
    else {
      return { resultCount: 0, results: [] }
    }
  } catch (error) {
    if (error) {
      return error
    }
  }
}
