import styled from 'styled-components'

const Form = styled.form`
  margin-bottom: 2rem;

  .query-label {
    font-size: 1rem;
  }

  div:last-child {
    border-radius: .25em;
    border: 1px solid #eeeeee;
    display: flex;

    button {
      min-width: 44px;
      min-height: 44px;
      border: none;
      background-color: ${props => props.theme.colors.gray};
      display: flex;
      justify-content: center;
      align-items: center;

      :focus {
        outline: none;
      }

      :hover {
        background-color: ${props => props.theme.colors.darkerGray};
        cursor: pointer;
      }
    }
  }
`

export { Form }