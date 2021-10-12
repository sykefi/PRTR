import { Button } from '@chakra-ui/button'
import { EmailIcon } from '@chakra-ui/icons'
import { Flex } from '@chakra-ui/layout'
import { useTranslation } from 'react-i18next'

export const Footer = () => {
  const { t } = useTranslation()

  return (
    <Flex
      direction="column"
      background="white"
      color="black"
      p={8}
      fontStyle="italic"
      align="center">
      <Flex
        width="100%"
        paddingX={{ base: 0, md: 80 }}
        justify={{ base: 'center', md: 'flex-end' }}>
        <a href="mailto:PRTR@syke.fi">
          <Button leftIcon={<EmailIcon />} variant="solid">
            {t('footer.sendFeedbackButtonLabel')}
          </Button>
        </a>
      </Flex>
    </Flex>
  )
}
