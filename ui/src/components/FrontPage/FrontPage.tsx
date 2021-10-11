import { Box, Flex, Heading } from '@chakra-ui/layout'
import { useTranslation } from 'react-i18next'
import { FrontPageContentFi } from './FrontPageContentFi'
import { FrontPageContentSv } from './FrontPageContentSv'
import { FrontPageContentEn } from './FrontPageContentEn'

export const FrontPage = () => {
  const { t, i18n } = useTranslation()

  return (
    <Flex direction="column" align="center" p={3}>
      <Box
        p={6}
        data-cy="front-page-content"
        width="100%"
        minWidth={250}
        maxWidth={900}
        background="white"
        borderRadius="md"
        boxShadow="sm">
        <Heading as="h3" fontSize="larger">
          {t('common.welcomeMessage')}
        </Heading>
        {i18n.language === 'fi' && <FrontPageContentFi />}
        {i18n.language === 'sv' && <FrontPageContentSv />}
        {i18n.language === 'en' && <FrontPageContentEn />}
      </Box>
    </Flex>
  )
}
