import { Box } from '@chakra-ui/layout'
import { useTranslation } from 'react-i18next'

export const FacilityReleaseInfo = ({ facilityId }: { facilityId: string }) => {
  const { t } = useTranslation()
  return (
    <Box
      width={450}
      minWidth={250}
      maxWidth="100%"
      m={2}
      paddingX={5}
      paddingY={2}
      height="max-content"
      maxHeight={600}
      overflowY="auto"
      background="white"
      borderRadius="md"
      boxShadow="sm">
      <Box as="h1" fontWeight="semibold" marginY={2}>
        {t('facilities.facilityReleaseInfo')}
      </Box>
    </Box>
  )
}
