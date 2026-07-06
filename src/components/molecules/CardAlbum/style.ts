import styled from 'styled-components'

import { breakpoints, px } from 'src/utils'

const Container = styled.div`
  img,
  video {
    box-shadow: 0 0.25em 0.5em 0 rgba(0, 0, 0, 0.2),
      0 6px 20px 0 rgba(0, 0, 0, 0.19), 0 0 2.5em -0.5em var(--accent, transparent);
    transition: box-shadow 0.4s ease;
  }

  video {
    display: block;
  }

  width: 19em;
  margin: 0em 1.5em 3em;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  img,
  video {
    margin-bottom: 0.5em;
  }

  > div:last-child {
    display: flex;
    flex-direction: column-reverse;
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

const ArtworkWrapper = styled.div`
  position: relative;

  video {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    transition: opacity 0.3s ease;

    &.is-visible {
      opacity: 1;
    }
  }
`

const AlbumTitle = styled.div`
  margin-bottom: 0.5em;

  @media only screen and (min-width: ${px(breakpoints.tablet.min)}) {
    line-height: 1.2em;
    min-height: 2.4em;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
`

const DownloadButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 0.5em;
`

const DownloadButtonWrapper = styled.div`
  display: flex;

  button {
    border: 1px solid ${(props) => props.theme.colors.primary};
    cursor: pointer;
  }

  > :not(:first-child) button,
  > button:not(:first-child) {
    border-left: none;
  }

  > :first-child button,
  > button:first-child {
    border-radius: 5px 0px 0px 5px;
  }

  > :last-child button,
  > button:last-child {
    border-radius: 0px 5px 5px 0px;
  }
`

const HDText = styled.span`
  font-style: italic;
`

const MotionDialog = styled.dialog`
  border: none;
  border-radius: 8px;
  padding: 1.5em;
  max-width: 20em;
  text-align: center;
  box-shadow: 0 6px 20px 0 rgba(0, 0, 0, 0.19);

  &::backdrop {
    background: rgba(0, 0, 0, 0.4);
  }

  p {
    margin: 0 0 1em;
  }

  button {
    border: 1px solid ${(props) => props.theme.colors.primary};
    border-radius: 5px;
    padding: 0 1.5em;
  }
`

export {
  Container,
  ArtworkWrapper,
  DownloadButtonContainer,
  AlbumTitle,
  DownloadButtonWrapper,
  HDText,
  MotionDialog,
}
