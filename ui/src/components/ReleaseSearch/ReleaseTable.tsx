import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/table'
import { IconButton } from '@chakra-ui/react'
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { useLocation } from 'react-router-dom'
import { Link as ReactRouterLink } from 'react-router-dom'
import { Badge, Box, Flex, Link } from '@chakra-ui/layout'
import { useTranslation } from 'react-i18next'
import { Tooltip } from '@chakra-ui/react'
import { PollutantRelease } from '../../api/models/PollutantRelease'
import { LoadAnimation } from '../LoadAnimation/LoadAnimation'
import {
  colorSchemeByMethodCode,
  translationKeyByMethodCode
} from '../../constants'
import { getPollutantLabel } from '../../utils'

export const ReleaseTable = ({
  loading,
  releases,
  sort,
  updateSortKey
}: {
  loading: boolean
  releases: PollutantRelease[]
  sort: {sortKey: string; descending: boolean}
  updateSortKey: (newSortKey: string, newDescending: boolean) => void
}) => {
  const location = useLocation()
  const { t } = useTranslation([
    'translation',
    'pollutantName',
    'pollutantAbbreviation',
    'pollutantCasNumber'
  ])

  return (
    <Box
      data-cy="releases-table"
      width={900}
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
      {loading && releases.length > 5 && (
        <Flex margin={3} justify="center" data-cy="releases-load-animation">
          <LoadAnimation sizePx={30} />
        </Flex>
      )}
      <Table variant="simple" marginY={4} boxSizing="border-box">
        <Thead>
          <Tr>
            <Th p={1} paddingRight={3} color="gray.800" fontSize="smaller">
              {t('translation:common.year')} 
              <IconButton 
              onClick={() => updateSortKey("year", sort.descending)}
              aria-label='Toggle between ascending and descending order'
              size='xs'
              variant={sort.sortKey === "year" ? "solid" : "outline"}
              colorScheme={sort.sortKey === "year" ? "blue" : "gray"}
              icon={sort.descending ? <FaAngleDown/> : <FaAngleUp/>} />
            </Th>
            <Th p={1} color="gray.800" fontSize="smaller">
              {t('translation:releases.quantity')} (kg)
              <IconButton 
              onClick={() => updateSortKey("quantity", sort.descending)}
              aria-label='Toggle between ascending and descending order'
              size='xs'
              variant={sort.sortKey === "quantity" ? "solid" : "outline"}
              colorScheme={sort.sortKey === "quantity" ? "blue" : "gray"}
              icon = {sort.descending ? <FaAngleDown/> : <FaAngleUp/>}/>
            </Th>
            <Th p={1} color="gray.800" fontSize="smaller">
              {t('translation:releases.pollutant')}
              <IconButton 
              onClick={() => updateSortKey("pollutant", sort.descending)} 
              aria-label='Toggle between ascending and descending order'
              size='xs'
              variant={sort.sortKey === "pollutant" ? "solid" : "outline"}
              colorScheme={sort.sortKey === "pollutant" ? "blue" : "gray"}
              icon = {sort.descending ? <FaAngleDown/> : <FaAngleUp/>}/>
            </Th>
            <Th p={1} color="gray.800" fontSize="smaller">
              {t('translation:common.facility')}
              <IconButton onClick={() => updateSortKey("facility", sort.descending)} 
              aria-label='Toggle between ascending and descending order'
              size='xs'
              variant={sort.sortKey === "facility" ? "solid" : "outline"}
              colorScheme={sort.sortKey === "facility" ? "blue" : "gray"}
              icon = {sort.descending ? <FaAngleDown/> : <FaAngleUp/>}/>
            </Th>
            <Th p={1} color="gray.800" fontSize="smaller">
              {t('translation:releases.method.title')}
              <IconButton 
              onClick={() => updateSortKey("method", sort.descending)} 
              aria-label='Toggle between ascending and descending order'
              size='xs'
              variant={sort.sortKey === "method" ? "solid" : "outline"}
              colorScheme={sort.sortKey === "method" ? "blue" : "gray"}
              icon={sort.descending ? <FaAngleDown/> : <FaAngleUp/>}/>
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
                  {r.totalPollutantQuantityKg.toLocaleString('fi')}
                </Td>
                <Td p={1} maxWidth={140} paddingRight={3}>
                  {getPollutantLabel(t, r.pollutantCode)}
                </Td>
                <Td p={1} maxWidth={240}>
                  <Link
                    as={ReactRouterLink}
                    textDecoration="underline"
                    lineHeight="tight"
                    overflowWrap="normal"
                    whiteSpace="unset"
                    overflow="hidden"
                    to={{
                      pathname: '/facilities/' + r.facilityId,
                      state: { from: location.pathname }
                      // store the current (i.e. previous) path in location.state.from so that we know where we came from
                    }}>
                    {r.nameOfFeature}
                  </Link>
                </Td>
                <Td p={1}>
                  <Tooltip
                    label={t(
                      `translation:releases.method.${
                        translationKeyByMethodCode[r.methodCode]
                      }Tooltip`
                    )}>
                    <Badge
                      whiteSpace={{ base: 'unset', sm: 'nowrap' }}
                      colorScheme={colorSchemeByMethodCode[r.methodCode]}>
                      {t(
                        `translation:releases.method.${
                          translationKeyByMethodCode[r.methodCode]
                        }`
                      )}
                    </Badge>
                  </Tooltip>
                </Td>
              </Tr>
            )
          })}
        </Tbody>
      </Table>
      {loading && releases.length <= 5 && (
        <Flex margin={3} justify="center" data-cy="releases-load-animation">
          <LoadAnimation sizePx={30} />
        </Flex>
      )}
    </Box>
  )
}
