import { Flex, Text } from '@chakra-ui/layout'
import { useTranslation } from 'react-i18next'

export const Footer = () => {
  const { t } = useTranslation()

  return (
    <Flex
      direction="column"
      background="darkgrey"
      color="white"
      p={8}
      paddingX={12}
      fontStyle="italic"
      align="center">
      <Flex
        data-cy="front-page-content"
        width="100%"
        direction="column"
        align="center"
        minWidth={250}
        maxWidth={900}>
        <Text marginBottom={1.5}>{t('footer.feedbackToAuthorities')}</Text>
        <Text>{t('footer.feedbackToPrtrTeam')}</Text>
      </Flex>
    </Flex>
  )
}
