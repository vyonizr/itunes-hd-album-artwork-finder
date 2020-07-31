import styled from 'styled-components'

const Input = styled.input`
  padding: 12px;
  height: 2.25em;
  border: none;
  background-color: #fafafa;

  :focus {
      outline: none;
  }

  ::placeholder {
    color: $placeholder;
  }
`

export { Input }