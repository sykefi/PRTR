import { Flex, Icon } from '@chakra-ui/react'
import { Menu, MenuItem, MenuButton, Button, MenuList } from '@chakra-ui/react'
import { FaGlobeEurope } from 'react-icons/fa'
import { BiChevronDown } from 'react-icons/bi'
import { useTranslation } from 'react-i18next'

export const LanguageSelect = () => {
  const { i18n } = useTranslation()

  return (
    <Flex alignItems={'center'}>
      <Menu>
        <MenuButton
          as={Button}
          boxShadow="md"
          rounded={'full'}
          variant={'link'}
          cursor={'pointer'}
          minW={0}
          padding="5px 12px"
          _focus={{
            border: 'initial',
            color: '#1876f2'
          }}
          _active={{ border: 'initial', color: '#1876f2' }}>
          <Icon
            w={4}
            h={4}
            color="grey.600"
            as={FaGlobeEurope}
            marginRight={2}
            marginBottom={1}
          />
          {i18n.language === 'fi'
            ? 'Suomi'
            : i18n.language === 'sv'
            ? 'Svenska'
            : 'English'}
          <Icon
            w={4}
            h={4}
            marginLeft={1}
            marginBottom={1}
            color="grey.600"
            as={BiChevronDown}
          />
        </MenuButton>
        <MenuList>
          <MenuItem onClick={() => i18n.changeLanguage('fi')}>Suomi</MenuItem>
          <MenuItem onClick={() => i18n.changeLanguage('sv')}>Svenska</MenuItem>
          <MenuItem onClick={() => i18n.changeLanguage('en')}>English</MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  )
}
