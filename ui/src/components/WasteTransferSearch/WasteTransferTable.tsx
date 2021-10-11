import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/table'
import { Link as ReactRouterLink } from 'react-router-dom'
import { Badge, Box, Flex, Link } from '@chakra-ui/layout'
import { WasteTransfer } from '../../api/models/WasteTransfer'
import { LoadAnimation } from '../LoadAnimation/LoadAnimation'
import {
  colorSchemeByWasteClassification,
  colorSchemeByWasteTreatment
} from '../../constants'

const getReceiverLabel = (wt: WasteTransfer): string => {
  const locationString = wt.receivingSiteCity
    ? wt.receivingSiteCity +
      (wt.receivingSiteCountryName ? `, ${wt.receivingSiteCountryName}` : '')
    : wt.receivingSiteCountryName || ''

  return wt.nameOfReceiver
    ? `${wt.nameOfReceiver}${locationString && ' (' + locationString + ')'}`
    : locationString
    ? locationString
    : '-'
}

export const WasteTransferTable = ({
  loading,
  wasteTransfers
}: {
  loading: boolean
  wasteTransfers: WasteTransfer[]
}) => {
  const location = useLocation()
  const { t } = useTranslation()

  return (
    <Box
      data-cy="waste-transfer-table"
      width={920}
      minWidth={250}
      maxWidth="100%"
      height="max-content"
      maxHeight={{ base: 'initial', sm: 'max(600px, calc(100vh - 345px))' }}
      overflowY={{ base: 'initial', sm: 'auto' }}
      alignSelf={{ base: 'flex-start', sm: 'unset' }}
      overflowX="auto"
      paddingX={5}
      paddingY={2}
      background="white"
      borderRadius="md"
      boxShadow="md">
      {loading && wasteTransfers.length > 5 && (
        <Flex
          margin={3}
          justify="center"
          data-cy="waste-transfers-load-animation">
          <LoadAnimation sizePx={30} />
        </Flex>
      )}
      <Table variant="simple" marginY={4} boxSizing="border-box">
        <Thead>
          <Tr>
            <Th p={1} paddingRight={1.5} color="gray.800" fontSize="smaller">
              {t('common.facility')}
            </Th>
            <Th p={1} paddingRight={1.5} color="gray.800" fontSize="smaller">
              {t('common.placename')}
            </Th>
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
                <Td p={1} paddingRight={2}>
                  <Link
                    as={ReactRouterLink}
                    textDecoration="underline"
                    lineHeight="tight"
                    overflowWrap="normal"
                    whiteSpace="unset"
                    overflow="hidden"
                    to={{
                      pathname: '/facilities/' + wt.facilityId,
                      state: { from: location.pathname }
                      // store the current (i.e. previous) path in location.state.from so that we know where we came from
                    }}>
                    {wt.nameOfFeature}
                  </Link>
                </Td>
                <Td p={1} paddingRight={2}>
                  {wt.city}
                </Td>
                <Td p={1}>
                  <Badge
                    colorScheme={
                      colorSchemeByWasteClassification[
                        wt.wasteClassificationCode
                      ]
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
      {loading && wasteTransfers.length <= 5 && (
        <Flex
          margin={3}
          justify="center"
          data-cy="waste-transfers-load-animation">
          <LoadAnimation sizePx={30} />
        </Flex>
      )}
    </Box>
  )
}
