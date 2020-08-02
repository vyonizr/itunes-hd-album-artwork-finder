import React from 'react'
import { myTheme } from 'src/styles/theme'

type Props = {
  size?: number
  fill?: string
}

const IconSearch = (props: Props) => {
  const { size = 24, fill=`${myTheme.colors.secondary}` } = props
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={size} viewBox={`0 0 ${size} ${size}`} width={size}>
      <path d="M0 0h24v24H0z" fill="none"/>
      <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" fill={fill}/>
    </svg>
  )
}

export default IconSearch