import { describe, it, expect } from 'vitest'

import { mapAmpAlbumToITunesAlbum, AmpAlbumItem } from './mapAmpAlbum'

// Real AMP catalog search response shape for Linkin Park's "From Zero",
// captured while designing this feature - see
// docs/superpowers/specs/2026-07-06-search-relevance-design.md.
const realFromZeroItem: AmpAlbumItem = {
  id: '1766137049',
  attributes: {
    artistName: 'LINKIN PARK',
    name: 'From Zero',
    artwork: {
      url: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/69/21/cf/6921cff3-7074-118a-ece2-4012450e6c75/093624839811.jpg/{w}x{h}bb.jpg',
    },
    releaseDate: '2024-11-15',
  },
}

describe('mapAmpAlbumToITunesAlbum', () => {
  it('maps core fields from a real AMP album item', () => {
    const result = mapAmpAlbumToITunesAlbum(realFromZeroItem)

    expect(result.collectionId).toBe(1766137049)
    expect(result.artistName).toBe('LINKIN PARK')
    expect(result.collectionName).toBe('From Zero')
    expect(result.releaseDate).toBe('2024-11-15')
    expect(result.year).toBe(2024)
  })

  it('substitutes the {w}x{h} artwork template into fixed-size URLs', () => {
    const result = mapAmpAlbumToITunesAlbum(realFromZeroItem)

    expect(result.artworkUrl60).toBe(
      'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/69/21/cf/6921cff3-7074-118a-ece2-4012450e6c75/093624839811.jpg/60x60bb.jpg'
    )
    expect(result.artworkUrl100).toBe(
      'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/69/21/cf/6921cff3-7074-118a-ece2-4012450e6c75/093624839811.jpg/100x100bb.jpg'
    )
  })
})
