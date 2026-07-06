import styled from 'styled-components'

const Button = styled('button')<{ $primary?: boolean }>`
  min-height: 44px;
  min-width: 44px;
  background-color: ${(props) =>
    props.$primary ? props.theme.colors.primary : props.theme.colors.white};
  color: ${(props) =>
    props.$primary ? props.theme.colors.white : props.theme.colors.primary};
  border: none;

  &:hover {
    cursor: pointer;
    background-color: ${(props) =>
      props.$primary
        ? props.theme.colors.primaryHover
        : props.theme.colors.light};
  }
`

export { Button }
