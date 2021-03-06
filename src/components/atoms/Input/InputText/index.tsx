import React, { memo } from 'react'
import { withTheme } from 'styled-components'

import { Input } from './style'

type Props = {
  value: string
  id: string
  onChange: (event: { target: HTMLInputElement }) => void
  placeholder?: string
}

const TextInput = memo((props: Props) => {
  return <Input type='text' {...props} />
}) as any

export default withTheme(TextInput)
