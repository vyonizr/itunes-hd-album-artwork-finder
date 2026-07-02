import React from 'react'

import { Button } from './style'

type Props = {
  onClick?: () => void
  children: React.ReactNode
  primary?: boolean
}

const ButtonDiv = ({ primary = false, ...props }: Props) => (
  <Button $primary={primary} {...props} />
)

export default ButtonDiv
