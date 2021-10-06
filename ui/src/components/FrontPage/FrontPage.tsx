import { Box, Flex, Heading, Link, Text } from '@chakra-ui/layout'
import { Trans, useTranslation } from 'react-i18next'
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
        boxShadow="md">
        <Heading as="h3" fontSize="larger">
          {t('common.welcomeMessage')}
        </Heading>
        {i18n.language === 'fi' && <FrontPageContentFi />}
        {i18n.language === 'sv' && <FrontPageContentSv />}
        {i18n.language === 'en' && <FrontPageContentEn />}

        {/* TODO: remove the placeholder content below */}
        <Text paddingTop={4} fontWeight="normal">
          {t('textContent.p1')}
        </Text>
        <Text paddingTop={5} fontWeight="normal">
          <Trans i18nKey="textContent.p2">
            <Link
              textDecoration="underline"
              target="_blank"
              href="https://www.eea.europa.eu/data-and-maps/data/industrial-reporting-under-the-industrial-3"
              rel="noopener noreferrer external"></Link>
          </Trans>
        </Text>
      </Box>
    </Flex>
  )
}
