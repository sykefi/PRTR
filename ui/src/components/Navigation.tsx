import {
  Box,
  Flex,
  HStack,
  Link,
  Icon,
  IconButton,
  useDisclosure,
  useColorModeValue,
  Stack
} from '@chakra-ui/react'
import { GiFactory } from 'react-icons/gi'
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons'
import { NavLink as RrLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { NavigationItem, RoutePath } from '../models'

const NavLink = ({ navigationItem }: { navigationItem: NavigationItem }) => {
  const { t } = useTranslation()
  const displayText = t(navigationItem.tKey)

  return (
    <Link
      as={RrLink}
      to={'/' + navigationItem.path}
      exact={navigationItem.path === RoutePath.FrontPage}
      px={2}
      py={1}
      rounded={'md'}
      _hover={{
        textDecoration: 'none',
        bg: useColorModeValue('gray.200', 'gray.700')
      }}
      _after={{
        display: 'block',
        content: `"${displayText}"`,
        fontWeight: 600,
        height: '1px',
        color: 'transparent',
        overflow: 'hidden',
        visibility: 'hidden'
      }}
      _activeLink={{ fontWeight: 600 }}
      href={'#'}>
      {displayText}
    </Link>
  )
}

const Navigation = ({
  navigationItems
}: {
  navigationItems: NavigationItem[]
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Box boxShadow="md" bg="white" px={4} data-cy="navigation-panel">
        <Flex h={16} align="center" justifyContent="center">
          <IconButton
            size={'md'}
            marginRight={4}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ sm: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} align="center">
            <Flex align="center">
              <Icon
                w={9}
                h={9}
                color="blue.600"
                as={GiFactory}
                paddingBottom={1}
              />
              <Box
                fontWeight="bold"
                letterSpacing={0.2}
                color="blue.600"
                marginX={0.5}>
                FIN-PRTR
              </Box>
            </Flex>
            <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', sm: 'flex' }}>
              {navigationItems.map(item => (
                <NavLink key={item.path} navigationItem={item} />
              ))}
            </HStack>
          </HStack>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ sm: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              {navigationItems.map(item => (
                <NavLink key={item.path} navigationItem={item} />
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  )
}

export default Navigation
