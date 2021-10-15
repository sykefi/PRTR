import {
  Box,
  Flex,
  HStack,
  Link,
  IconButton,
  useDisclosure,
  useColorModeValue,
  Icon,
  Stack
} from '@chakra-ui/react'
import { GiFactory } from 'react-icons/gi'
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons'
import { NavLink as RrLink } from 'react-router-dom'
import { TFuncKey, useTranslation } from 'react-i18next'
import { NavigationItem } from '../../models/NavigationItem'
import { RoutePath } from '../../models/RoutePath'
import { LanguageSelect } from './LanguageSelect'

const NavLink = ({
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
      whiteSpace="nowrap"
      color="blackAlpha.700"
      fontWeight={600}
      fontSize={{ base: 'lg', sm: 'md', xl: 'lg' }}
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
        top="29px"
        marginTop="-5px"
        width="calc(100% + var(--chakra-space-4))"
        borderTop="3px solid transparent"
        borderTopLeftRadius="1px"
        borderTopRightRadius="1px"
        left={-2}
      />
    </Link>
  )
}

const PrtrLogo = () => {
  return (
    <RrLink to={RoutePath.FrontPage} data-cy="front-page-nav">
      <Flex
        marginY={1}
        marginTop="-1px"
        marginLeft={{ base: -1, sm: 3 }}
        marginRight={{ base: 0, md: 2, lg: 6 }}
        letterSpacing={0.2}
        fontWeight="bold"
        color="blue.600"
        direction="column"
        align="center"
        justify="center"
        whiteSpace="nowrap">
        <Flex align="center">
          <Icon
            w={10}
            h={10}
            as={GiFactory}
            paddingBottom={1}
            marginRight={1}
            marginLeft="-2px"
          />
          <Box
            whiteSpace="nowrap"
            letterSpacing={2}
            fontSize={{ base: 20, md: 24 }}
            marginBottom={{ base: '0px', md: '-2px' }}>
            FINPRTR
          </Box>
        </Flex>
        <Box
          marginTop="-4px"
          fontSize={{ base: 12, md: '0.77em' }}
          whiteSpace="nowrap">
          SUOMEN PÄÄSTÖREKISTERI
        </Box>
      </Flex>
    </RrLink>
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
        <Flex h={20} align="center" justifyContent="center">
          <IconButton
            size={'md'}
            marginX={4}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <PrtrLogo />
          <HStack
            as={'nav'}
            spacing={{ base: 0, sm: 0.5, lg: 2 }}
            display={{ base: 'none', md: 'flex' }}>
            {navigationItems.map(item => (
              <NavLink key={item.path} navigationItem={item} />
            ))}
          </HStack>
          <LanguageSelect />
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
