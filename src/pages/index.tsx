import React, { FunctionComponent, useState } from 'react'
import Head from 'next/head'

import { Container, AlbumContainer } from 'src/styles/Home'
import Anchor from 'src/components/atoms/Anchor'
import SearchForm from 'src/components/molecules/SearchForm'
import CardAlbum from 'src/components/molecules/CardAlbum'
import { useAlbumSearch } from 'src/hooks'
import { ITunesAlbum } from 'src/types'

const Home: FunctionComponent = () => {
  const { albums, searchAlbums, isError, isLoading } = useAlbumSearch()
  const [hasSearch, setHasSearch] = useState<boolean>(false)

  const handleSubmitQuery = (
    event: React.FormEvent<HTMLFormElement>,
    query: string
  ) => {
    setHasSearch(true)
    event.preventDefault()
    const encodedQuery: string = encodeURI(query.replace(/\s/gi, '+'))
    searchAlbums(encodedQuery)
  }

  return (
    <Container>
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','GTM-NGM2PCH');
              `,
          }}
        />
        <title>iTunes HD Album Artwork Finder</title>
        <link rel='icon' href='/favicon.ico' />
        <meta charSet='UTF-8'></meta>
        <meta
          name='keywords'
          content='itunes, album, cover, artwork, downloader'
        ></meta>
        <meta name='author' content='Fitrahtur Rahman'></meta>
        <meta
          name='description'
          content='iTunes HD Album Artwork Finder'
        ></meta>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1.0'
        ></meta>
        <link
          rel='preload'
          href='/fonts/Inter/Inter-Regular.woff'
          as='font'
          crossOrigin=''
        />
        <link
          rel='preload'
          href='/fonts/Inter/Inter-Bold.woff'
          as='font'
          crossOrigin=''
        />
      </Head>

      <h2 style={{ textAlign: 'center' }}>iTunes HD Album Artwork Finder</h2>
      <SearchForm onSubmit={handleSubmitQuery} />

      <AlbumContainer>
        {isError ? (
          <span>Something wrong happened. Please refresh the page.</span>
        ) : isLoading ? (
          <span>Please wait...</span>
        ) : albums.length === 0 && hasSearch ? (
          <span>No results found</span>
        ) : (
          albums.map((album: ITunesAlbum, idx: number) => (
            <CardAlbum key={idx} album={album} />
          ))
        )}
      </AlbumContainer>

      <footer>
        © {new Date().getFullYear()}{' '}
        <Anchor href='https://vyonizr.com/'>vyonizr</Anchor>
      </footer>
    </Container>
  )
}

export default Home
