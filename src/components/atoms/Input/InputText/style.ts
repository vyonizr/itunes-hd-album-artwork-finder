import styled from 'styled-components'

const Input = styled.input`
  padding: 12px;
  min-height: 44px;
  border: none;
  background-color: ${props => props.theme.colors.light};
  font-size: 16px;

  :focus {
    outline: none;
    background-color: none;
  }

  ::placeholder {
    background-color: ${props => props.theme.colors.light};
  }
`

export { Input }