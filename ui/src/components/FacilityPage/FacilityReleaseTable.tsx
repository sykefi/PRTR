import { Badge, Box, Flex, Heading } from '@chakra-ui/layout'
import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/table'
import { useQuery } from 'react-query'
import { useTranslation } from 'react-i18next'
import * as env from '../../env'
import { Medium } from '../../api/models/Medium'
import { PollutantRelease } from '../../api/models/PollutantRelease'
import { getReleases } from '../../api/releases'
import { LoadAnimation } from '../LoadAnimation/LoadAnimation'
import { useGetPollutantLabel } from '../../hooks/useGetPollutantLabel'

const ReleaseTable = ({ releases }: { releases: PollutantRelease[] }) => {
  const getPollutantLabel = useGetPollutantLabel()
  const { t } = useTranslation([
    'translation',
    'pollutantName',
    'pollutantAbbreviation'
  ])

  return (
    <Table variant="simple" marginY={4} boxSizing="border-box">
      <Thead>
        <Tr>
          <Th p={1} paddingRight={3} color="gray.800" fontSize="smaller">
            {t('translation:common.year')}
          </Th>
          <Th p={1} color="gray.800" fontSize="smaller">
            {t('translation:releases.quantity')} (kg)
          </Th>
          <Th p={1} color="gray.800" fontSize="smaller">
            {t('translation:releases.pollutant')}
          </Th>
          <Th p={1} color="gray.800" fontSize="smaller">
            {t('translation:releases.releaseMediumType')}
          </Th>
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
                {getPollutantLabel(r.pollutantCode)}
              </Td>
              <Td p={1}>
                <Badge
                  whiteSpace={{ base: 'unset', sm: 'nowrap' }}
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

export const FacilityReleaseTable = ({
  basicInfoIsLoading,
  basicInfoIsError,
  facilityId
}: {
  basicInfoIsLoading: boolean
  basicInfoIsError: boolean
  facilityId: string
}) => {
  const { t } = useTranslation(['translation'])

  const { isLoading, isError, isSuccess, data } = useQuery(
    ['facilityReleases', facilityId],
    () => getReleases({ facility_id: facilityId }),
    {
      // let's fetch the list of releases only if basic info fetch succeeded
      enabled: !basicInfoIsLoading && !basicInfoIsError,
      retry: 2,
      ...env.rqCacheSettings
    }
  )

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
        {t('translation:facilities.facilityReleaseTable')}
      </Heading>
      {data && data.data.length > 0 && <ReleaseTable releases={data.data} />}
      {(basicInfoIsLoading || isLoading) && (
        <Flex p={2} justify="center" data-cy="facility-releases-load-animation">
          <LoadAnimation sizePx={30} />
        </Flex>
      )}
      {data && isSuccess && data.data.length === 0 && (
        <Box marginY={2.0}>
          {t('translation:facilities.noReleasesFoundForFacility')}
        </Box>
      )}
      {(basicInfoIsError || isError) && (
        <Box marginY={2.0}>
          {t('translation:facilities.couldNotFindFacilityReleases')}
        </Box>
      )}
    </Box>
  )
}