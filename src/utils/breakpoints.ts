import { Breakpoints } from 'src/types'

const breakpoints: Breakpoints = {
  mobile: {
    min: '0px',
    max: '480px'
  },
  tablet: {
    min: '481px',
    max: '768px'
  },
  laptop: {
    min: '769px',
    max: '1024px'
  },
  desktop: {
    min: '1025px',
    max: '1200ox'
  },
  tv: {
    min: '1201px',
    max: null
  }
}

export default breakpoints