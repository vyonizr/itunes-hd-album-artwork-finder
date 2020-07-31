import React, { FunctionComponent, useState } from 'react'
import Head from 'next/head'
import { Container } from 'src/styles/Home'
import { useAlbumSearch } from 'src/pages/hooks/useAlbumSearch'
import { ITunesAlbum } from 'src/types'
import SearchForm from 'src/components/molecules/SearchForm'
import CardAlbum from 'src/components/molecules/CardAlbum'

const Home: FunctionComponent = () => {
  const { albums, searchAlbums, isError, isLoading } = useAlbumSearch()
  const [hasSearch, setHasSearch] = useState<boolean>(false)

  const handleSubmitQuery = (event: React.FormEvent<HTMLFormElement>, query: string) => {
    setHasSearch(true)
    event.preventDefault()
    const encodedQuery:string = encodeURI(query.replace(/\s/gi, '+'))
    searchAlbums(encodedQuery)
  }

  return (
    <Container>
      <Head>
        <title>iTunes Album Artwork Finder</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h2>iTunes Album Artwork Finder</h2>
      <SearchForm onSubmit={handleSubmitQuery} />

      <div>
        {
          isError ? (
            <div>{isError}</div>
          ) :
          isLoading ? (
            <div>Please wait...</div>
          ) :
          (albums.length === 0 && hasSearch) ? (
            <div>No results found</div>
          ) : (
            albums.map((album: ITunesAlbum, idx: number) => (
              <CardAlbum key={idx} album={album} />
            ))
          )
        }
      </div>

      <footer>
        © {new Date().getFullYear()}{" "}
        <a
          href="https://vyonizr.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          vyonizr
        </a>
      </footer>
    </Container>
  )
}

export default Home