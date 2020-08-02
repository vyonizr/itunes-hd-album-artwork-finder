import styled from 'styled-components'

const Button = styled.button`
  height: 2.25em;
  border: none;
  background-color: ${props => props.theme.colors.primary};
  display: flex;
  justify-content: center;
  align-items: center;

  :focus {
    outline: none;
  }

  :hover {
    cursor: pointer;
    background-color: ${props => props.theme.colors.primaryHover};
  }
`

export { Button }