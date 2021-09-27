import { Flex, HStack } from '@chakra-ui/layout'
import { useRouteMatch } from 'react-router'
import { Medium } from '../../api/models/Medium'
import { NavigationItem, RoutePath } from '../../models'
import { NavLink } from '../Navigation'
import { ReleasesSearch } from './ReleasesSearch'

const navigationItems: NavigationItem[] = [
  { tKey: 'common.releasesToAir', path: RoutePath.ReleasesToAir },
  { tKey: 'common.releasesToWater', path: RoutePath.ReleasesToWater }
]

export const ReleasesMainPage = () => {
  const matchReleasesToAir = useRouteMatch('/' + RoutePath.ReleasesToAir)
  const matchReleasesToWater = useRouteMatch('/' + RoutePath.ReleasesToWater)

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
                <NavLink
                  key={item.path}
                  navigationItem={item}
                  hideUnderlineOnMobile={false}
                />
              ))}
            </HStack>
          </HStack>
        </Flex>
      </Flex>
      {matchReleasesToAir?.isExact && <ReleasesSearch medium={Medium.AIR} />}
      {matchReleasesToWater?.isExact && (
        <ReleasesSearch medium={Medium.WATER} />
      )}
    </>
  )
}
