import { Box } from '@chakra-ui/layout'

export const SearchInfo = ({ text }: { text: string }) => {
  return (
    <Box paddingX={{ base: 0, md: 10 }} paddingY={2}>
      {text}
    </Box>
  )
}
