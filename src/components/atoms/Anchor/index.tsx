import React from 'react'

type Props = {
  href: string
  children: React.ReactNode
}

const Anchor = ({ href, children }: Props) => <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>

export default Anchor