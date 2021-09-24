import { Flex } from '@chakra-ui/layout'

export const BelowNavigationHeaderPanel = ({
  children,
  gap,
  withYPadding
}: {
  children: React.ReactNode
  gap?: number
  withYPadding?: boolean
}) => {
  return (
    <Flex
      w="100%"
      justify="center"
      align="center"
      background="white"
      paddingX={7}
      paddingTop={(withYPadding && 6) || 3}
      paddingBottom={(withYPadding && 5) || 1}
      boxShadow="sm"
      sx={{ gap: `var(--chakra-space-${gap || 3})` }}
      wrap="wrap">
      {children}
    </Flex>
  )
}
