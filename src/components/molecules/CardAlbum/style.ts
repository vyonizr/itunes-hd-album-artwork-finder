import styled from 'styled-components'

const Container = styled.div`
  @media only screen and (max-width: 768px) {
    min-height: 105px;
    margin-bottom: 1rem;
    display: grid;
    grid-template-columns: 7rem auto;

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
  }
`

export { Container }