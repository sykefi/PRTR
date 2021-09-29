import { Button } from '@chakra-ui/button'
import { Box } from '@chakra-ui/layout'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'

export const FacilitySearchResultInfo = ({
  resultCount
}: {
  resultCount: number
}) => {
  const { t } = useTranslation()
  const history = useHistory()

  return (
    <Box data-cy="search-result-info">
      <Box marginBottom={2.0} fontWeight="bold">
        {t('facilities.facilitySearchResult', {
          resultCount
        })}
      </Box>
      <Box>
        <Button
          data-cy="exit-results-btn"
          marginTop={2.0}
          size="sm"
          colorScheme="orange"
          onClick={() => history.push('/facilities')}>
          {t('common.goBack')}
        </Button>
      </Box>
    </Box>
  )
}
