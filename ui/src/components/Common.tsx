import { Flex } from '@chakra-ui/layout'

export const BelowNavigationHeaderPanel = ({
  children,
  withYPadding
}: {
  children: React.ReactNode
  withYPadding?: boolean
}) => {
  return (
    <Flex
      w="100%"
      justify="center"
      align="center"
      background="white"
      paddingX={{ base: 2, md: 4 }}
      paddingTop={(withYPadding && 6) || 3}
      paddingBottom={(withYPadding && 5) || 1}
      boxShadow="sm"
      sx={{ gap: 4 }}
      wrap="wrap">
      {children}
    </Flex>
  )
}
