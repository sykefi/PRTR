import styled from 'styled-components'
import { Box, Flex } from '@chakra-ui/layout'
import { useTranslation } from 'react-i18next'
import { FrontPageContentFi } from './FrontPageContentFi'
import { FrontPageContentSv } from './FrontPageContentSv'
import { FrontPageContentEn } from './FrontPageContentEn'

const FrontPageStyleWrapper = styled.div`
  h2 {
    font-size: 22px;
    margin-top: 10px;
    margin-bottom: 5px;
  }
  p {
    margin: 10px 0px;
  }
  a {
    text-decoration: underline;
  }
  margin-bottom: -10px;
`

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
        <Box marginBottom={4} fontWeight="bold">
          {t('common.welcomeMessage')}
        </Box>
        <FrontPageStyleWrapper>
          {i18n.language === 'fi' && <FrontPageContentFi />}
          {i18n.language === 'sv' && <FrontPageContentSv />}
          {i18n.language === 'en' && <FrontPageContentEn />}
        </FrontPageStyleWrapper>
      </Box>
    </Flex>
  )
}
