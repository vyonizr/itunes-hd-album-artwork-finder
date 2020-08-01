import 'styled-components'

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string
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
      darkerGrayHover: string
    }
  }
}