import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/table'
import { IconButton } from '@chakra-ui/react'
import { FaAngleDown, FaAngleUp } from 'react-icons/fa'
import { Link as ReactRouterLink } from 'react-router-dom'
import { Badge, Box, Flex, Link } from '@chakra-ui/layout'
import { Tooltip } from '@chakra-ui/tooltip'
import styled from 'styled-components'
import { WasteTransfer } from '../../api/models/WasteTransfer'
import { LoadAnimation } from '../LoadAnimation/LoadAnimation'
import {
  colorSchemeByWasteClassification,
  colorSchemeByWasteTreatment
} from '../../constants'
import { getReceiverLabel } from '../../utils'

const SortIconStack = styled.span`
  display: grid;
  svg {
    grid-area: 0.5 / 0.5;
  }
`

const ColumnHeaderIcon = ({
  sort,
  columnKey
}: {
  sort: { sortKey: string; descending: boolean }
  columnKey: string
}) => {
  return (
    <>
      {sort.sortKey === columnKey && sort.descending && <FaAngleDown />}
      {sort.sortKey === columnKey && !sort.descending && <FaAngleUp />}
      {sort.sortKey !== columnKey && (
        <SortIconStack>
          <FaAngleUp />
          <FaAngleDown />
        </SortIconStack>
      )}
    </>
  )
}

export const WasteTransferTable = ({
  loading,
  wasteTransfers,
  sort,
  updateSortKey
}: {
  loading: boolean
  wasteTransfers: WasteTransfer[]
  sort: { sortKey: string; descending: boolean }
  updateSortKey: (newSortKey: string, newDescending: boolean) => void
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
              <IconButton
                onClick={() => updateSortKey('facility', sort.descending)}
                aria-label="Toggle between ascending and descending order"
                size="xs"
                variant={sort.sortKey === 'facility' ? 'solid' : 'outline'}
                colorScheme={sort.sortKey === 'facility' ? 'blue' : 'gray'}
                icon={<ColumnHeaderIcon sort={sort} columnKey="facility" />}
                marginLeft="4px"
              />
            </Th>
            <Th p={1} paddingRight={1.5} color="gray.800" fontSize="smaller">
              {t('common.placename')}
              <IconButton
                onClick={() => updateSortKey('place', sort.descending)}
                aria-label="Toggle between ascending and descending order"
                size="xs"
                variant={sort.sortKey === 'place' ? 'solid' : 'outline'}
                colorScheme={sort.sortKey === 'place' ? 'blue' : 'gray'}
                icon={<ColumnHeaderIcon sort={sort} columnKey="place" />}
                marginLeft="4px"
              />
            </Th>
            <Th p={1} paddingRight={1.5} color="gray.800" fontSize="smaller">
              {t('wasteTransfers.classification.title')}
              <IconButton
                onClick={() => updateSortKey('classification', sort.descending)}
                aria-label="Toggle between ascending and descending order"
                size="xs"
                variant={
                  sort.sortKey === 'classification' ? 'solid' : 'outline'
                }
                colorScheme={
                  sort.sortKey === 'classification' ? 'blue' : 'gray'
                }
                icon={
                  <ColumnHeaderIcon sort={sort} columnKey="classification" />
                }
                marginLeft="4px"
              />
            </Th>
            <Th p={1} paddingRight={1.5} color="gray.800" fontSize="smaller">
              {t('common.year')}
              <IconButton
                onClick={() => updateSortKey('year', sort.descending)}
                aria-label="Toggle between ascending and descending order"
                size="xs"
                variant={sort.sortKey === 'year' ? 'solid' : 'outline'}
                colorScheme={sort.sortKey === 'year' ? 'blue' : 'gray'}
                icon={<ColumnHeaderIcon sort={sort} columnKey="year" />}
                marginLeft="4px"
              />
            </Th>
            <Th p={1} paddingRight={1.5} color="gray.800" fontSize="smaller">
              {t('wasteTransfers.quantity')} (t)
              <IconButton
                onClick={() => updateSortKey('quantity', sort.descending)}
                aria-label="Toggle between ascending and descending order"
                size="xs"
                variant={sort.sortKey === 'quantity' ? 'solid' : 'outline'}
                colorScheme={sort.sortKey === 'quantity' ? 'blue' : 'gray'}
                icon={<ColumnHeaderIcon sort={sort} columnKey="quantity" />}
                marginLeft="4px"
              />
            </Th>
            <Th p={1} paddingRight={1.5} color="gray.800" fontSize="smaller">
              {t('wasteTransfers.treatment.title')}
              <IconButton
                onClick={() => updateSortKey('treatment', sort.descending)}
                aria-label="Toggle between ascending and descending order"
                size="xs"
                variant={sort.sortKey === 'treatment' ? 'solid' : 'outline'}
                colorScheme={sort.sortKey === 'treatment' ? 'blue' : 'gray'}
                icon={<ColumnHeaderIcon sort={sort} columnKey="treatment" />}
                marginLeft="4px"
              />
            </Th>
            <Th p={1} paddingRight={5} color="gray.800" fontSize="smaller">
              {t('wasteTransfers.receiver')}
              <IconButton
                onClick={() => updateSortKey('receiver', sort.descending)}
                aria-label="Toggle between ascending and descending order"
                size="xs"
                variant={sort.sortKey === 'receiver' ? 'solid' : 'outline'}
                colorScheme={sort.sortKey === 'receiver' ? 'blue' : 'gray'}
                icon={<ColumnHeaderIcon sort={sort} columnKey="receiver" />}
                marginLeft="4px"
              />
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
                  <Tooltip
                    label={t(
                      `wasteTransfers.classification.${wt.wasteClassificationCode}shortTooltip`
                    )}>
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
                  </Tooltip>
                </Td>
                <Td p={1} paddingRight={3}>
                  {wt.reportingYear}
                </Td>
                <Td p={1}>{wt.totalWasteQuantityTNE.toLocaleString('fi')}</Td>
                <Td p={1} paddingRight={2}>
                  <Tooltip
                    label={t(
                      `wasteTransfers.treatment.${wt.wasteTreatmentCode}Tooltip`
                    )}>
                    <Badge
                      colorScheme={
                        colorSchemeByWasteTreatment[wt.wasteTreatmentCode]
                      }>
                      {t(`wasteTransfers.treatment.${wt.wasteTreatmentCode}`)}
                    </Badge>
                  </Tooltip>
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
