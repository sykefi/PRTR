import { useQuery } from 'react-query'
import { Box, Flex, Heading } from '@chakra-ui/layout'
import { Button } from '@chakra-ui/button'
import { useHistory, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import * as env from '../../env'
import { getFacility } from '../../api'
import { BelowNavigationHeaderPanel } from '../Common'
import { OlMap } from '../OlMap'
import { FacilityReleaseTable } from './FacilityReleaseTable'
import { FacilityBasicInfo } from './FacilityBasicInfo'

type FacilityParams = {
  facilityId: string
}

export const FacilityPage = () => {
  const history = useHistory()
  const location = useLocation<{ from?: string }>()
  const { t } = useTranslation(['translation', 'mainActivityCodeDesc'])
  const { facilityId } = useParams<FacilityParams>()

  const { isLoading, isError, data } = useQuery(
    ['facility', facilityId],
    async () => await getFacility(facilityId),
    {
      retry: false,
      ...env.rqCacheSettings
    }
  )

  const previousPathIsFacilityList =
    !!location.state && location.state.from?.includes('facilities')

  const previousPathIsReleaseList =
    !!location.state && location.state.from?.includes('releases')

  const handleExit = () => {
    if (
      // go back to search page if we came from there
      previousPathIsFacilityList ||
      previousPathIsReleaseList
    ) {
      history.goBack()
    } else {
      // go back to facility list if previous location is unknown
      history.push('/facilities')
    }
  }

  const exitLabel = t(
    previousPathIsReleaseList
      ? 'translation:facilities.goBackToReleaseSearch'
      : 'translation:facilities.goBackToFacilitySearch'
  )

  return (
    <>
      {(data || isLoading) && (
        <BelowNavigationHeaderPanel withYPadding>
          <Box>
            <Button
              data-cy="exit-results-btn"
              size="sm"
              colorScheme="blue"
              onClick={handleExit}>
              {exitLabel}
            </Button>
          </Box>
          <Heading as="h3" size="md" data-cy="facility-page-title">
            {data?.nameOfFeature}
          </Heading>
          {isLoading && (
            <Heading as="h3" size="md" fontWeight="semibold">
              {t('translation:common.loadingInformation')}
            </Heading>
          )}
        </BelowNavigationHeaderPanel>
      )}
      <Flex
        wrap="wrap"
        justify="center"
        maxWidth="100%"
        sx={{ gap: 'var(--chakra-space-3)' }}
        padding={3}
        data-cy="facility-info-container">
        <FacilityBasicInfo
          loading={isLoading}
          error={isError}
          facility={data}
        />
        <FacilityReleaseTable
          basicInfoIsLoading={isLoading}
          basicInfoIsError={isError}
          facilityId={facilityId}
        />
        <OlMap
          width={450}
          height={500}
          facilities={data ? [data] : undefined}
          zoomToInitialExtent={false}
        />
      </Flex>
    </>
  )
}
