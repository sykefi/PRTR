import { Box, Flex } from '@chakra-ui/layout'

export const SearchInfo = ({ text }: { text: string }) => {
  return (
    <Flex width="100%" justify="center">
      <Box paddingX={{ base: 0, md: 10 }} paddingY={2}>
        {text}
      </Box>
    </Flex>
  )
}
