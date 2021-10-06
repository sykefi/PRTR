import { Flex, Icon } from '@chakra-ui/react'
import { Menu, MenuItem, MenuButton, Button, MenuList } from '@chakra-ui/react'
import { FaGlobeEurope } from 'react-icons/fa'
import { BiChevronDown } from 'react-icons/bi'
import { useTranslation } from 'react-i18next'

const languageLocalNameById: Record<string, string> = {
  fi: 'Suomi',
  sv: 'Svenska',
  en: 'English'
}

const languageNameById: Record<string, string> = {
  fi: 'Finnish',
  sv: 'Swedish',
  en: 'English'
}

const getLanguageName = (lng: string): string => {
  if (lng in languageNameById) {
    return languageNameById[lng]
  }
  return lng
}

const LanguageOptionButton = ({
  lng,
  label
}: {
  lng: string
  label: string
}) => {
  const { i18n } = useTranslation()
  const isActiveLang = (lng: string): boolean => i18n.language === lng

  return (
    <MenuItem
      role="button"
      aria-label={'Change language to: ' + getLanguageName(lng)}
      fontWeight={isActiveLang(lng) ? 'semibold' : 'initial'}
      color={isActiveLang(lng) ? '#1876f2' : 'initial'}
      disabled={isActiveLang(lng)}
      onClick={() => i18n.changeLanguage(lng)}>
      {label}
    </MenuItem>
  )
}

export const LanguageSelect = () => {
  const { i18n } = useTranslation()

  return (
    <Flex alignItems={'center'} minWidth={133}>
      <Menu>
        <MenuButton
          as={Button}
          boxShadow="md"
          aria-label={'Selected language: ' + getLanguageName(i18n.language)}
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
          {(i18n.language in languageLocalNameById &&
            languageLocalNameById[i18n.language]) ||
            'select language'}
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
          <LanguageOptionButton lng="fi" label="Suomi" />
          <LanguageOptionButton lng="sv" label="Svenska" />
          <LanguageOptionButton lng="en" label="English" />
        </MenuList>
      </Menu>
    </Flex>
  )
}
