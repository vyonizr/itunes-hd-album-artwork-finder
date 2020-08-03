import React from 'react'
import IconSearch from 'src/assets/icons/IconSearch'
import { Button } from './style'

type Props = {
  ['aria-label']?: string
}

const ButtonSubmit = (props: Props) => {
  return (
    <Button type="submit" {...props}><IconSearch /></Button>
  )
}

export default ButtonSubmit
