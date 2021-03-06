import styled from 'styled-components'

import { breakpoints, px } from 'src/utils'

const Container = styled.div`
  img {
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }

  -webkit-animation: fadein 0.5s; /* Safari, Chrome and Opera > 12.1 */
  -moz-animation: fadein 0.5s; /* Firefox < 16 */
  -ms-animation: fadein 0.5s; /* Internet Explorer */
  -o-animation: fadein 0.5s; /* Opera < 12.1 */
  animation: fadein 0.5s;

  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  /* Firefox < 16 */
  @-moz-keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  /* Safari, Chrome and Opera > 12.1 */
  @-webkit-keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  /* Internet Explorer */
  @-ms-keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  /* Opera < 12.1 */
  @-o-keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`

const AlbumDetails = styled.div`
  @media only screen and (min-width: ${px(
      breakpoints.mobile.min
    )}) and (max-width: ${px(breakpoints.mobile.max)}) {
    min-height: 105px;
    margin-bottom: 1rem;
    display: grid;
    grid-template-columns: 7rem auto;
  }

  @media only screen and (min-width: ${px(breakpoints.tablet.min)}) {
    width: 19rem;
    margin: 0rem 1.5rem 3rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    img {
      margin-bottom: 0.5rem;
    }

    > div:last-child {
      display: flex;
      flex-direction: column-reverse;
    }
  }
`

const AlbumTitle = styled.div`
  margin-bottom: 0.5rem;
`

const DownloadButtonContainer = styled.div`
  display: flex;

  @media only screen and (min-width: ${px(breakpoints.tablet.min)}) {
    justify-content: center;
    margin-bottom: 0.5rem;
  }

  > * {
    margin-right: 0.5rem;

    button {
      cursor: pointer;
    }

    :last-child {
      margin: 0;
    }
  }
`

export { AlbumDetails, Container, DownloadButtonContainer, AlbumTitle }
