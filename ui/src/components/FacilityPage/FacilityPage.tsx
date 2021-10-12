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
import { FacilityWasteTransferTable } from './FacilityWasteTransferTable'

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
    () => getFacility(facilityId),
    {
      retry: false,
      ...env.rqCacheSettings
    }
  )

  const previousPathIsFacilityList =
    !!location.state && location.state.from?.includes('facilities')

  const previousPathIsReleaseList =
    !!location.state && location.state.from?.includes('releases')

  const previousPathIsWasteTransferList =
    !!location.state && location.state.from?.includes('wasteTransfers')

  const handleExit = () => {
    if (
      // go back to one of the search pages if we came from there
      previousPathIsFacilityList ||
      previousPathIsReleaseList ||
      previousPathIsWasteTransferList
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
      : previousPathIsFacilityList
      ? 'translation:facilities.goBackToFacilitySearch'
      : 'translation:facilities.goBackToWasteTransferSearch'
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
        <Flex wrap="wrap" maxWidth="100%" sx={{ gap: 'var(--chakra-space-3)' }}>
          <FacilityBasicInfo
            loading={isLoading}
            error={isError}
            facility={data}
            handleExit={handleExit}
            exitLabel={exitLabel}
          />
          <OlMap
            width={450}
            height={400}
            facilities={data ? [data] : undefined}
            zoomToInitialExtent={false}
          />
        </Flex>
        <Flex wrap="wrap" maxWidth="100%" sx={{ gap: 'var(--chakra-space-3)' }}>
          <FacilityReleaseTable
            basicInfoIsLoading={isLoading}
            basicInfoIsError={isError}
            facilityId={facilityId}
          />
          <FacilityWasteTransferTable
            basicInfoIsLoading={isLoading}
            basicInfoIsError={isError}
            facilityId={facilityId}
          />
        </Flex>
      </Flex>
    </>
  )
}
