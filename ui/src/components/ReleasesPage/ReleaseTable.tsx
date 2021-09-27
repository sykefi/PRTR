import { Badge, Box } from '@chakra-ui/layout'
import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/table'
import { useTranslation } from 'react-i18next'
import { Medium } from '../../api/models/Medium'
import { PollutantRelease } from '../../api/models/PollutantRelease'

export const ReleaseTable = ({
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
    <Box
      data-cy="facility-release-info"
      width={450}
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
    </Box>
  )
}
