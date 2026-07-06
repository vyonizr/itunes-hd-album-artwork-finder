import styled from 'styled-components'

const Button = styled.button`
  height: 44px;
  border: none;
  background-color: ${props => props.theme.colors.primary};
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    cursor: pointer;
    background-color: ${props => props.theme.colors.primaryHover};
  }
`

export { Button }