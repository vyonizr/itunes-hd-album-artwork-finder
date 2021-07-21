import styled from 'styled-components'

const Form = styled.form`
  margin-bottom: 2em;

  .query-label {
    font-size: 1em;
  }

  > div:last-child {
    width: 100%;
    height: 44px;
    display: flex;

    > div:first-child {
      width: 250px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 0;
      -webkit-border-radius: 0;

      input {
        width: 100%;
        border-radius: 0;
        -webkit-border-radius: 0;
      }
    }

    button {
      min-width: 44px;
      min-height: 44px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
`

const ClearQueryButton = styled.div`
  padding: 0 10px;
  height: 44px;
  background-color: ${(props) => props.theme.colors.light};
  display: flex;
  flex: 0 1 44px;
  justify-content: center;
  align-items: center;

  :hover {
    cursor: pointer;
  }
`

export { Form, ClearQueryButton }
