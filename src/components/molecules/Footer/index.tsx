import React from 'react'

import Anchor from 'src/components/atoms/Anchor'
import { StyledFooter } from './style'

const Footer = () => {
  return (
    <StyledFooter>
      <div>
        © 2020-{new Date().getFullYear()}{' '}
        <Anchor href='https://vyonizr.com/'>vyonizr</Anchor>
      </div>
      <small>
        Not affiliated with Apple Inc. Animated artwork technique inspired by{' '}
        <Anchor href='https://github.com/m8tec/apple-music-animated-artworks'>
          m8tec
        </Anchor>
        .
      </small>
    </StyledFooter>
  )
}

export default Footer
