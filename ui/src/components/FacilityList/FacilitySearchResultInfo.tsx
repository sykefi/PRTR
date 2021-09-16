import { Button } from '@chakra-ui/button'
import { Box } from '@chakra-ui/layout'
import { useTranslation } from 'react-i18next'

export const FacilitySearchResultInfo = ({
  urlSearchTerm,
  resultCount,
  handleExitResults
}: {
  urlSearchTerm: string | null
  resultCount: number
  handleExitResults: () => void
}) => {
  const { t } = useTranslation()

  return (
    <Box>
      <Box margin={1.0} marginBottom={2.0} fontWeight="bold">
        {t('common.facilitySearchResult', {
          searchTerm: urlSearchTerm,
          resultCount
        })}
      </Box>
      <Box>
        <Button
          marginTop={2.0}
          marginBottom={2.0}
          size="sm"
          colorScheme="orange"
          onClick={handleExitResults}>
          {t('common.goBack')}
        </Button>
      </Box>
    </Box>
  )
}
