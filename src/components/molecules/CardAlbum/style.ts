import styled from 'styled-components'
import breakpoints from 'src/utils/breakpoints'

const Container = styled.div`
  img {
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }

  -webkit-animation: fadein .5s; /* Safari, Chrome and Opera > 12.1 */
      -moz-animation: fadein .5s; /* Firefox < 16 */
      -ms-animation: fadein .5s; /* Internet Explorer */
        -o-animation: fadein .5s; /* Opera < 12.1 */
          animation: fadein .5s;

  @keyframes fadein {
      from { opacity: 0; }
      to   { opacity: 1; }
  }

  /* Firefox < 16 */
  @-moz-keyframes fadein {
      from { opacity: 0; }
      to   { opacity: 1; }
  }

  /* Safari, Chrome and Opera > 12.1 */
  @-webkit-keyframes fadein {
      from { opacity: 0; }
      to   { opacity: 1; }
  }

  /* Internet Explorer */
  @-ms-keyframes fadein {
      from { opacity: 0; }
      to   { opacity: 1; }
  }

  /* Opera < 12.1 */
  @-o-keyframes fadein {
      from { opacity: 0; }
      to   { opacity: 1; }
  }
`

const ContainerMobile = styled.div`
  min-height: 105px;
  margin-bottom: 1rem;
  display: grid;
  grid-template-columns: 7rem auto;
`
const ContainerTablet = styled.div`
  width: 19rem;
  margin: 0rem 1.5rem 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  img {
    margin-bottom: .5rem;
  }

  > div:last-child {
    display: flex;
    flex-direction: column-reverse;
  }
`

const AlbumDetail = styled.div`
  margin-bottom: .5rem;
`

const DownloadButtonContainer = styled.div`
  display: flex;

  @media only screen and (min-width: ${breakpoints.tablet.min}) {
    justify-content: center;
    margin-bottom: .5rem;
  }

  @media only screen and (min-width: ${breakpoints.tablet.min}) {
    justify-content: center;
    margin-bottom: .5rem;
  }

  > * {
    margin: 0 .25rem;

    button {
      cursor: pointer;
    }
  }
`

export {
  Container,
  ContainerMobile,
  ContainerTablet,
  AlbumDetail,
  DownloadButtonContainer
}