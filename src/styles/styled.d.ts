import 'styled-components'

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string
      primaryHover: string
      secondary: string
      success: string
      danger: string
      warning: string
      light: string
      dark: string
      white: string
      placeholder: string
      gray: string
      darkerGray: string
      inputBg: string
    }
  }
}