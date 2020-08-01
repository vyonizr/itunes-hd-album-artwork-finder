import React from 'react'
import { withTheme } from 'styled-components'
import { Button } from './style'

type Props = {
  onClick?: () => void
  children: React.ReactNode
}

const ButtonDiv = (props: Props) => (<Button {...props} />)

export default withTheme(ButtonDiv as any)