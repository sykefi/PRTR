import {
  Box,
  Flex,
  Text,
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
import { TFuncKey, useTranslation } from 'react-i18next'
import { NavigationItem } from '../../models/NavigationItem'
import { RoutePath } from '../../models/RoutePath'
import { LanguageSelect } from './LanguageSelect'

export const NavLink = ({
  navigationItem,
  search
}: {
  navigationItem: NavigationItem
  search?: string
}) => {
  const { t } = useTranslation()
  const displayText = t(navigationItem.tKey as TFuncKey)

  return (
    <Link
      as={RrLink}
      to={{
        pathname: navigationItem.path,
        search
      }}
      exact={navigationItem.path === RoutePath.FrontPage}
      px={2}
      py={1}
      color="blackAlpha.700"
      fontWeight={600}
      fontSize="lg"
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
      _activeLink={{
        fontWeight: 600,
        color: '#1876f2',
        '&>div': { borderColor: '#1876f2' }
      }}
      _focus={{
        background: 'initial',
        color: '#1876f2',
        '&>div': { borderColor: '#1876f2' }
      }}
      href={'#'}>
      {displayText}
      <Box
        visibility={{
          base: 'hidden',
          md: 'initial'
        }}
        position="relative"
        top="21px"
        marginTop="-6px"
        width="calc(100% + var(--chakra-space-4))"
        borderTop="3px solid transparent"
        borderTopLeftRadius="1px"
        borderTopRightRadius="1px"
        left={-2}
      />
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
      <Box
        boxShadow="md"
        bg="white"
        position="relative"
        zIndex={10}
        px={4}
        data-cy="navigation-panel">
        <RrLink to={RoutePath.FrontPage}>
          <Flex
            align="center"
            justify="center"
            paddingTop={2}
            marginBottom={-0.5}
            color="blue.600">
            <Icon
              w={6}
              h={6}
              as={GiFactory}
              paddingBottom={1}
              marginRight={1}
            />
            <Box fontWeight="bold" letterSpacing={0.2} marginX={0.5}>
              <Text as="span"> FIN-PRTR</Text>
              <Text as="span"> - </Text>
              <Text as="span">suomalainen päästörekisteri</Text>
            </Box>
          </Flex>
        </RrLink>
        <Flex h={16} align="center" justifyContent="center">
          <IconButton
            size={'md'}
            marginX={4}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} align="center">
            <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}>
              {navigationItems.map(item => (
                <NavLink key={item.path} navigationItem={item} />
              ))}
            </HStack>
            <LanguageSelect />
          </HStack>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
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
