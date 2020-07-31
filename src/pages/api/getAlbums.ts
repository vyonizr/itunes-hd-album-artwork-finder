// https://is4-ssl.mzstatic.com/image/thumb/Music123/v4/67/04/4b/67044b41-ca0d-7903-84b2-35ed89803577/source/100x100bb.jpg
// https://is4-ssl.mzstatic.com/image/thumb/Music123/v4/67/04/4b/67044b41-ca0d-7903-84b2-35ed89803577/source/100000x100000-999.jpg
// https://itunes.apple.com/search?term=jack+johnson&entity=album

import { ITunesAlbumFetch } from '../../types'

export const getAlbums = async (albumName: string): Promise<any> => {
  const baseURL:string = 'https://itunes.apple.com/search'

  try {
    if (albumName.length > 0) {
      const response = await fetch(`${baseURL}?term=${albumName}&entity=album`)
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
