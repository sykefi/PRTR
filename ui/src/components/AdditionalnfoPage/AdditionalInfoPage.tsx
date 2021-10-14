import styled from 'styled-components'
import { Box, Flex } from '@chakra-ui/layout'
import { useTranslation } from 'react-i18next'
import { AdditionalInfoPageContentFi } from './AdditionalInfoPageContentFi'
import { AdditionalInfoPageContentSv } from './AdditionalInfoPageContentSv'
import { AdditionalInfoPageContentEn } from './AdditionalInfoPageContentEn'

const DevTitle = styled.h2`
  font-size: 22px;
  margin-top: -2;
  margin-bottom: 12px;
`

const AdditionalInfoPageStyleWrapper = styled.div`
  h2 {
    font-size: 22px;
    margin-bottom: 5px;
  }
  p {
    margin: 10px 0px;
  }
  a {
    text-decoration: underline;
  }
  li {
    margin-left: 20px;
  }
  margin-bottom: -10px;
`

export const AdditionalInfoPage = () => {
  const { t, i18n } = useTranslation()

  return (
    <Flex direction="column" align="center" p={3}>
      <Box
        p={6}
        data-cy="additional-info-page-content"
        width="100%"
        minWidth={250}
        maxWidth={900}
        background="white"
        borderRadius="md"
        boxShadow="sm">
        <AdditionalInfoPageStyleWrapper>
          {i18n.language === 'fi' && <AdditionalInfoPageContentFi />}
          {i18n.language === 'sv' && <AdditionalInfoPageContentSv />}
          {i18n.language === 'en' && <AdditionalInfoPageContentEn />}
        </AdditionalInfoPageStyleWrapper>
      </Box>
    </Flex>
  )
}
