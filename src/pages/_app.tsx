import { AppProps } from 'next/app'
import { ThemeProvider } from 'styled-components'
import { myTheme } from 'src/styles/theme'
import GlobalStyle from 'src/styles/globalStyle'

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ThemeProvider theme={myTheme}>
      <GlobalStyle />
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default MyApp
