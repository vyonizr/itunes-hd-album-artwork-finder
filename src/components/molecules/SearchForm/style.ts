import styled from 'styled-components'

const Form = styled.form`
  margin-bottom: 2rem;

  .query-label {
    font-size: 1rem;
  }
  > div:last-child {
    width: 100%;
    height: 44px;
    display: flex;
    flex: auto 1;
    align-items: center;

    > div:first-child {
      position: relative;
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
  width: 44px;
  height: 44px;
  background-color: ${props => props.theme.colors.light};
  position: absolute;
  z-index: 1;
  right: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`

export { Form, ClearQueryButton }