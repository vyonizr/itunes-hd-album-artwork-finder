import styled from 'styled-components'

const Button = styled.form`
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
`

export { Button }