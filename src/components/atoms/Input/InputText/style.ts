import styled from 'styled-components'

const Input = styled.input`
  padding: 12px;
  min-height: 44px;
  border: none;
  background-color: #fafafa;

  :focus {
    outline: none;
    background-color: none;
  }

  ::placeholder {
    color: ${props => props.theme.colors.placeholder};
  }
`

export { Input }