import { useEffect, useState } from 'react'
import { Box, Flex, Heading } from '@chakra-ui/layout'
import { Button } from '@chakra-ui/button'
import { useHistory, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { getFacility } from '../../api'
import { Facility } from '../../api/models/Facility'
import { BelowNavigationHeaderPanel } from '../Common'
import { OlMap } from '../OlMap'
import { FacilityReleaseInfo } from './FacilityReleaseInfo'
import { FacilityBasicInfo } from './FacilityBasicInfo'

type FacilityParams = {
  facilityId: string
}

export const FacilityPage = () => {
  const history = useHistory()
  const location = useLocation<{ from?: string }>()
  const [infoState, setInfoState] = useState<
    'initial' | 'loading' | 'error' | 'done'
  >('initial')
  const loading = infoState === 'initial' || infoState === 'loading'
  const { t } = useTranslation(['translation', 'mainActivityCodeDesc'])
  const [facility, setFacility] = useState<Facility | null>(null)
  const { facilityId } = useParams<FacilityParams>()

  useEffect(() => {
    console.log('fetching facility info for', facilityId)
    const controller = new AbortController()

    const getFacilityData = async () => {
      setInfoState('loading')
      try {
        const data = await getFacility(facilityId, controller.signal)
        setFacility(data)
        setInfoState('done')
      } catch (e) {
        if (!controller.signal.aborted) {
          console.error(e)
          setInfoState('error')
        }
      }
    }

    getFacilityData()

    return () => {
      controller.abort()
    }
  }, [facilityId])

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
      ? 'translation:facilities.goBackToReleasesSearch'
      : 'translation:facilities.goBackToFacilitySearch'
  )

  return (
    <>
      <BelowNavigationHeaderPanel withYPadding>
        {facility && (
          <>
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
              {facility?.nameOfFeature}
            </Heading>
          </>
        )}
        {loading && (
          <Heading as="h3" size="md" fontWeight="semibold">
            {t('translation:common.loadingInformation')}
          </Heading>
        )}
      </BelowNavigationHeaderPanel>
      <Flex
        wrap="wrap"
        justify="center"
        maxWidth="100%"
        sx={{ gap: 'var(--chakra-space-3)' }}
        padding={3}
        data-cy="facility-info-container">
        <FacilityBasicInfo
          loading={loading}
          error={infoState === 'error'}
          facility={facility}
        />
        <FacilityReleaseInfo facilityId={facilityId} />
        <OlMap
          width={450}
          height={500}
          facilities={facility ? [facility] : undefined}
          zoomToInitialExtent={false}
        />
      </Flex>
    </>
  )
}
