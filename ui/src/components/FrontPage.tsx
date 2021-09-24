import { Flex } from '@chakra-ui/layout'
import { useTranslation } from 'react-i18next'

export const FrontPage = () => {
  const { t } = useTranslation()
  return (
    <Flex p={6} fontWeight="semibold" justify="center">
      {t('common.welcomeMessage')}
    </Flex>
  )
}
