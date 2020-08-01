import React, { FunctionComponent, useState } from 'react'
import Head from 'next/head'
import { Container, AlbumContainer } from 'src/styles/Home'
import useAlbumSearch from 'src/hooks/useAlbumSearch'
import { ITunesAlbum } from 'src/types'
import Anchor from 'src/components/atoms/Anchor'
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
        <title>iTunes HD Album Artwork Finder</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h2>iTunes HD Album Artwork Finder</h2>
      <SearchForm onSubmit={handleSubmitQuery} />

      <AlbumContainer>
        {
          isError ? (
            <span>{isError}</span>
          ) :
          isLoading ? (
            <span>Please wait...</span>
          ) :
          (albums.length === 0 && hasSearch) ? (
            <span>No results found</span>
          ) : (
            albums.map((album: ITunesAlbum, idx: number) => (
              <CardAlbum key={idx} album={album} />
            ))
          )
        }
      </AlbumContainer>

      <footer>
        © {new Date().getFullYear()}{" "}
        <Anchor href="https://vyonizr.com/">vyonizr</Anchor>
      </footer>
    </Container>
  )
}

export default Home