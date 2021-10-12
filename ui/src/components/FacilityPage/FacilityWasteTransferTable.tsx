import { Badge, Box, Flex, Heading } from '@chakra-ui/layout'
import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/table'
import { useQuery } from 'react-query'
import { useTranslation } from 'react-i18next'
import * as env from '../../env'
import * as api from '../../api'
import { LoadAnimation } from '../LoadAnimation/LoadAnimation'

import { WasteTransfer } from '../../api/models/WasteTransfer'
import {
  colorSchemeByWasteClassification,
  colorSchemeByWasteTreatment
} from '../../constants'
import { getReceiverLabel } from '../../utils'

const WasteTransferTable = ({
  wasteTransfers
}: {
  wasteTransfers: WasteTransfer[]
}) => {
  const { t } = useTranslation()

  return (
    <Table variant="simple" marginY={4} boxSizing="border-box">
      <Thead>
        <Tr>
          <Th p={1} paddingRight={1.5} color="gray.800" fontSize="smaller">
            {t('wasteTransfers.classification.title')}
          </Th>
          <Th p={1} paddingRight={1.5} color="gray.800" fontSize="smaller">
            {t('common.year')}
          </Th>
          <Th p={1} paddingRight={1.5} color="gray.800" fontSize="smaller">
            {t('wasteTransfers.quantity')} (t)
          </Th>
          <Th p={1} paddingRight={1.5} color="gray.800" fontSize="smaller">
            {t('wasteTransfers.treatment.title')}
          </Th>
          <Th p={1} paddingRight={5} color="gray.800" fontSize="smaller">
            {t('wasteTransfers.receiver')}
          </Th>
        </Tr>
      </Thead>
      <Tbody>
        {wasteTransfers.map(wt => {
          return (
            <Tr key={wt.id}>
              <Td p={1}>
                <Badge
                  colorScheme={
                    colorSchemeByWasteClassification[wt.wasteClassificationCode]
                  }>
                  {t(
                    `wasteTransfers.classification.${wt.wasteClassificationCode}short`
                  )}
                </Badge>
              </Td>
              <Td p={1} paddingRight={3}>
                {wt.reportingYear}
              </Td>
              <Td p={1}>{wt.totalWasteQuantityTNE.toLocaleString('fi')}</Td>
              <Td p={1} paddingRight={2}>
                <Badge
                  colorScheme={
                    colorSchemeByWasteTreatment[wt.wasteTreatmentCode]
                  }>
                  {t(`wasteTransfers.treatment.${wt.wasteTreatmentCode}`)}
                </Badge>
              </Td>
              <Td p={1} paddingRight={3}>
                {getReceiverLabel(wt)}
              </Td>
            </Tr>
          )
        })}
      </Tbody>
    </Table>
  )
}

export const FacilityWasteTransferTable = ({
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
    ['facilityWasteTransfers', facilityId],
    () => api.getWasteTransfers({ facility_id: facilityId }),
    {
      // let's fetch the list of waste transfers only if basic info fetch succeeded
      enabled: !basicInfoIsLoading && !basicInfoIsError,
      retry: 2,
      ...env.rqCacheSettings
    }
  )

  return (
    <Box
      data-cy="facility-waste-transfer-info"
      width={560}
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
        {t('translation:facilities.facilityWasteTransferTable')}
      </Heading>
      {data && data.data.length > 0 && (
        <WasteTransferTable wasteTransfers={data.data} />
      )}
      {(basicInfoIsLoading || isLoading) && (
        <Flex
          p={2}
          justify="center"
          data-cy="facility-waste-transfers-load-animation">
          <LoadAnimation sizePx={30} />
        </Flex>
      )}
      {data && isSuccess && data.data.length === 0 && (
        <Box marginY={2.0}>
          {t('translation:facilities.noWasteTransfersFoundForFacility')}
        </Box>
      )}
      {(basicInfoIsError || isError) && (
        <Box marginY={2.0}>
          {t('translation:facilities.couldNotFindFacilityWasteTransfers')}
        </Box>
      )}
    </Box>
  )
}
