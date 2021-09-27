import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/table'
import { useLocation } from 'react-router-dom'
import { Link as ReactRouterLink } from 'react-router-dom'
import { Box, Link } from '@chakra-ui/layout'
import { useTranslation } from 'react-i18next'
import { PollutantReleaseWithFacilityInfo } from '../../api/models/PollutantReleaseWithFacilityInfo'
import { useGetPollutantLabel } from '../../hooks/useGetPollutantLabel'

export const ReleaseTable = ({
  releases
}: {
  releases: PollutantReleaseWithFacilityInfo[]
}) => {
  const location = useLocation()
  const getPollutantLabel = useGetPollutantLabel()
  const { t } = useTranslation([
    'translation',
    'pollutantName',
    'pollutantAbbreviation'
  ])

  return (
    <Box
      data-cy="releases-table"
      width={750}
      minWidth={250}
      maxWidth="100%"
      paddingX={5}
      paddingY={2}
      height="max-content"
      maxHeight={{ base: 'initial', sm: 'max(600px, calc(100vh - 345px))' }}
      overflowY={{ base: 'initial', sm: 'auto' }}
      overflowX="auto"
      background="white"
      borderRadius="md"
      boxShadow="md">
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
              {t('translation:common.facility')}
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
                <Td p={1} maxWidth={140} paddingRight={3}>
                  {getPollutantLabel(r.pollutantCode)}
                </Td>
                <Td p={1} maxWidth={240}>
                  <Link
                    as={ReactRouterLink}
                    lineHeight="tight"
                    overflowWrap="normal"
                    whiteSpace="unset"
                    overflow="hidden"
                    to={{
                      pathname: '/facilities/' + r.facilityId,
                      state: { from: location.pathname } // store the current (i.e. previous) path in location.state.from
                    }}>
                    {r.nameOfFeature}
                  </Link>
                </Td>
              </Tr>
            )
          })}
        </Tbody>
      </Table>
    </Box>
  )
}
