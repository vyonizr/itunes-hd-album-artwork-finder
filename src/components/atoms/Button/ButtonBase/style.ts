import styled from 'styled-components'

const Button = styled.button`
  min-height: 44px;
  min-width: 44px;
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.white};
  border-radius: 3px;
  border: none;

  :focus {
    outline: none;
  }

  :hover {
    cursor: pointer;
    background-color: ${props => props.theme.colors.primaryHover};
  }
`

export { Button }