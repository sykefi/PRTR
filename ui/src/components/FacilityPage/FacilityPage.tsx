import { Box, Flex, Heading } from '@chakra-ui/layout'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { getFacility } from '../../api'
import { Facility } from '../../api/models/Facility'
import { OlMap } from '../OlMap'
import { FacilityReleaseInfo } from './FacilityReleaseInfo'
import { FacilityBasicInfo } from './FacilityBasicInfo'
import { BelowNavigationHeaderPanel } from '../Commont'

type FacilityParams = {
  facilityId: string
}

export const FacilityPage = () => {
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
        const data = await getFacility(controller, facilityId)
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

  return (
    <>
      <BelowNavigationHeaderPanel withYPadding>
        <Heading as="h3" size="md" data-cy="facility-page-title">
          {facility?.nameOfFeature}
        </Heading>
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
        data-cy="facility-info-container">
        <FacilityBasicInfo
          loading={loading}
          error={infoState === 'error'}
          facility={facility}
        />
        <FacilityReleaseInfo facilityId={facilityId} />
        <OlMap
          margin={2}
          width={450}
          height={500}
          facilities={facility ? [facility] : undefined}
          zoomToInitialExtent={false}
        />
      </Flex>
    </>
  )
}
