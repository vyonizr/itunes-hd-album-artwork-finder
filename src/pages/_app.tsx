import 'src/styles/globals.css'
import { AppProps } from 'next/app'
import { ThemeProvider } from 'styled-components'
import { myTheme } from 'src/styles/theme'

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ThemeProvider theme={myTheme}>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default MyApp
