import { Breakpoints } from 'src/types'

const breakpoints: Breakpoints = {
  mobile: {
    min: 0,
    max: 480,
  },
  tablet: {
    min: 481,
    max: 768,
  },
  laptop: {
    min: 769,
    max: 1024,
  },
  desktop: {
    min: 1025,
    max: 1200,
  },
  tv: {
    min: 1201,
    max: null,
  },
}

export default breakpoints
