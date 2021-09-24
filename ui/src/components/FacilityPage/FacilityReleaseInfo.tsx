import { Badge, Box, Heading } from '@chakra-ui/layout'
import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/table'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Medium } from '../../api/models/Medium'
import { PollutantRelease } from '../../api/models/PollutantRelease'
import { getReleases } from '../../api/releases'
import { LoadAnimation } from '../LoadAnimation/LoadAnimation'

const FacilityReleaseTable = ({
  releases
}: {
  releases: PollutantRelease[]
}) => {
  const { t } = useTranslation([
    'translation',
    'pollutantName',
    'pollutantAbbreviation'
  ])

  return (
    <Table variant="simple" marginY={4} boxSizing="border-box">
      <Thead>
        <Tr>
          <Th p={1} paddingRight={3}>
            {t('translation:common.year')}
          </Th>
          <Th p={1}>{t('translation:releases.quantity')} (kg)</Th>
          <Th p={1}>{t('translation:releases.pollutant')}</Th>
          <Th p={1}>{t('translation:releases.releaseMediumType')}</Th>
        </Tr>
      </Thead>
      <Tbody>
        {releases.map(r => {
          return (
            <Tr key={r.id}>
              <Td p={1} paddingRight={3}>
                {r.reportingYear}
              </Td>
              <Td p={1} paddingRight={3}>
                {(
                  r.totalPollutantQuantityKg + r.AccidentalPollutantQuantityKG
                ).toLocaleString('fi')}
              </Td>
              <Td p={1} maxWidth={120} paddingRight={2}>
                {t(`pollutantAbbreviation:${r.pollutantCode}`) ||
                  t(`pollutantName:${r.pollutantCode}`)}
              </Td>
              <Td p={1}>
                <Badge
                  colorScheme={r.medium === Medium.AIR ? 'orange' : 'blue'}>
                  {t(
                    r.medium === Medium.AIR
                      ? 'translation:releases.releaseToAir'
                      : 'translation:releases.releaseToWater'
                  )}
                </Badge>
              </Td>
            </Tr>
          )
        })}
      </Tbody>
    </Table>
  )
}

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
      data-cy="facility-release-info"
      width={450}
      minWidth={250}
      maxWidth="100%"
      paddingX={5}
      paddingY={2}
      height="max-content"
      maxHeight={600}
      overflowY="auto"
      background="white"
      borderRadius="md"
      boxShadow="md">
      <Heading as="h3" size="md" fontWeight="semibold" marginY={3}>
        {t('translation:facilities.facilityReleaseInfo')}
      </Heading>
      {releases.length > 0 && <FacilityReleaseTable releases={releases} />}
      {loading && (
        <Box p={2} data-cy="facility-releases-load-animation">
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
