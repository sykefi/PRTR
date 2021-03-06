import { extendTheme } from '@chakra-ui/react'
import { createBreakpoints } from '@chakra-ui/theme-tools'

const breakpoints = createBreakpoints({
  sm: '560px',
  md: '1070px',
  lg: '1100px',
  xl: '1200px'
})

export const theme = extendTheme({
  breakpoints,
  styles: {
    global: {
      'html, body': {
        height: '100%',
        backgroundColor: '#f0f2f5'
      }
    }
  }
})
