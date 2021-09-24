import { Flex, HStack } from '@chakra-ui/layout'
import { useRouteMatch } from 'react-router'
import { NavigationItem, RoutePath } from '../../models'
import { BelowNavigationHeaderPanel } from '../Common'
import { NavLink } from '../Navigation'
import { ReleaseSelectorPanel } from './ReleasesSelectorPanel'

const navigationItems: NavigationItem[] = [
  { tKey: 'common.releasesToAir', path: RoutePath.ReleasesToAir },
  { tKey: 'common.releasesToWater', path: RoutePath.ReleasesToWater }
]

export const ReleasesMainPage = () => {
  const match = useRouteMatch('/' + RoutePath.Releases)

  return (
    <>
      <Flex
        w="100%"
        justify="center"
        align="center"
        background="white"
        paddingX={{ base: 1, md: 4 }}
        position="relative"
        zIndex={9}
        boxShadow="md">
        <Flex h={16} align="center" justifyContent="center">
          <HStack spacing={8} align="center">
            <HStack as={'nav'} spacing={4}>
              {navigationItems.map(item => (
                <NavLink key={item.path} navigationItem={item} />
              ))}
            </HStack>
          </HStack>
        </Flex>
      </Flex>
      {!match?.isExact && (
        <BelowNavigationHeaderPanel>
          <ReleaseSelectorPanel />
        </BelowNavigationHeaderPanel>
      )}
    </>
  )
}
