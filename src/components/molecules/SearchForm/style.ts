import styled from 'styled-components'

const Form = styled.form`
  margin-bottom: 2rem;

  .query-label {
    font-size: .875rem;
  }

  div:last-child {
    border-radius: .25em;
    border: 1px solid #eeeeee;
    display: flex;

    button {
      height: 2.25em;
      border: none;
      color: #eeeeee;
      display: flex;
      justify-content: center;
      align-items: center;

      :focus {
        outline: none;
      }

      :hover {
        color: #dddddd;
      }
    }
  }
`

export { Form }