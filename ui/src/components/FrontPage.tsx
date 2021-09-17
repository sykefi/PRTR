import { Box } from '@chakra-ui/layout'
import { useTranslation } from 'react-i18next'

export const FrontPage = () => {
  const { t } = useTranslation()
  return (
    <Box p={2} fontWeight="semibold">
      {t('common.welcomeMessage')}
    </Box>
  )
}
