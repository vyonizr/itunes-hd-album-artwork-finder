import styled from 'styled-components'

const Form = styled.form`
  margin-bottom: 2rem;

  .query-label {
    font-size: 1rem;
  }

  div:last-child {
    width: 100%;
    height: 44px;
    display: flex;
    flex: auto 1;
    align-items: center;

    button {
      min-width: 44px;
      min-height: 44px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
`

export { Form }