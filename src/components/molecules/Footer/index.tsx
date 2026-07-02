import React from 'react'

import Anchor from 'src/components/atoms/Anchor'
import { StyledFooter } from './style'

const Footer = () => {
  return (
    <StyledFooter>
      © 2020-{new Date().getFullYear()}{' '}
      <Anchor href='https://vyonizr.com/'>vyonizr</Anchor>
    </StyledFooter>
  )
}

export default Footer
