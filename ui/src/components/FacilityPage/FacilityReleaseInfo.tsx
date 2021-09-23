import { Box, Heading } from '@chakra-ui/layout'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PollutantRelease } from '../../api/models/PollutantRelease'
import { getReleases } from '../../api/releases'
import { LoadAnimation } from '../LoadAnimation/LoadAnimation'

export const FacilityReleaseInfo = ({ facilityId }: { facilityId: string }) => {
  const { t } = useTranslation(['translation'])
  const [releases, setReleases] = useState<PollutantRelease[] | []>([])
  const [infoState, setInfoState] = useState<
    'initial' | 'loading' | 'error' | 'done'
  >('initial')
  const loading = infoState === 'initial' || infoState === 'loading'

  useEffect(() => {
    console.log('fetching releases for', facilityId)
    const controller = new AbortController()

    const getFacilityData = async () => {
      setInfoState('loading')
      try {
        const data = await getReleases(controller, { facility_id: facilityId })
        setReleases(data)
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
      boxShadow="md">
      <Heading as="h3" size="md" fontWeight="semibold" marginY={2}>
        {t('translation:facilities.facilityReleaseInfo')}
      </Heading>
      {releases.map(r => {
        return <Box key={r.id}> {r.totalPollutantQuantityKg}</Box>
      })}
      {loading && (
        <Box p={2} data-cy="facility-info-load-animation">
          <LoadAnimation sizePx={30} />
        </Box>
      )}
      {infoState === 'done' && releases.length === 0 && (
        <Box marginY={2.0}>
          {t('translation:facilities.noReleasesFoundForFacility')}
        </Box>
      )}
      {infoState === 'error' && (
        <Box marginY={2.0}>
          {t('translation:facilities.couldNotFindFacilityReleases')}
        </Box>
      )}
    </Box>
  )
}
