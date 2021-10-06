import { extendTheme } from '@chakra-ui/react'
import { createBreakpoints } from '@chakra-ui/theme-tools'

const breakpoints = createBreakpoints({
  sm: '560px',
  md: '885px',
  lg: '1190px',
  xl: '1200px'
})

export const theme = extendTheme({
  breakpoints,
  styles: {
    global: {
      body: {
        backgroundColor: '#f0f2f5',
        height: '100%'
      }
    }
  }
})
