import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: "Inter";
    src: url("/fonts/Inter/Inter-Regular.woff");
    font-style: normal;
    font-weight: 400;
    font-display: swap;
  }

  @font-face {
    font-family: "Inter";
    src: url("/fonts/Inter/Inter-Bold.woff");
    font-style: bold;
    font-weight: 700;
    font-display: swap;
  }

  html,
  body {
    width: 100vw;
    height: 100vh;
    padding: 0;
    margin: 0;
    font-family: "Inter", "SF Pro Display", "SF Pro Icons", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
  }

  a {
    color: ${(props) => props.theme.colors.primary};
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  * {
    box-sizing: border-box;
  }
`

export default GlobalStyle
