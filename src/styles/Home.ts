import styled from 'styled-components'
import { px, breakpoints } from 'src/utils'

const Container = styled.div`
  min-height: 100vh;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  footer {
    margin: 1em 0;
  }
`

const AlbumContainer = styled.div`
  @media only screen and (min-width: ${px(breakpoints.tablet.min)}) {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
`

export { Container, AlbumContainer }
