import 'src/styles/globals.css'
import { AppProps } from 'next/app'
import { ThemeProvider } from 'styled-components'

const theme = {
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    success: '#28a745',
    danger: '#dc3545',
    warning: '#ffc107',
    light: '#f8f9fa',
    dark: '#343a40',
    white: '#ffffff',
    placeholder: 'hsla(240, 3%, 12%, 0.5)'
  }
}

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default MyApp
