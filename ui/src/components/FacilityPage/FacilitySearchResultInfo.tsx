import { Button } from '@chakra-ui/button'
import { Box } from '@chakra-ui/layout'
import { useTranslation } from 'react-i18next'

export const FacilitySearchResultInfo = ({
  urlSearchTerm,
  resultCount,
  handleExitResults
}: {
  urlSearchTerm: string | undefined
  resultCount: number
  handleExitResults: () => void
}) => {
  const { t } = useTranslation()

  return (
    <Box data-cy="search-result-info">
      <Box margin={1.0} marginBottom={2.0} fontWeight="bold">
        {(!!urlSearchTerm &&
          t('common.facilitySearchResult', {
            searchTerm: urlSearchTerm,
            resultCount
          })) ||
          t('common.facilitySearchResultCountText', {
            resultCount
          })}
      </Box>
      <Box>
        <Button
          data-cy="exit-results-btn"
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
