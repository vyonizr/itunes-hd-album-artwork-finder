import React from 'react'

import Anchor from 'src/components/atoms/Anchor'

const Footer = () => {
  return (
    <footer style={{ margin: '1em 0' }}>
      © {new Date().getFullYear()}{' '}
      <Anchor href='https://vyonizr.com/'>vyonizr</Anchor>
    </footer>
  )
}

export default Footer
