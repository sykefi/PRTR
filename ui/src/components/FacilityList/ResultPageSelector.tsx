import { Button, ButtonGroup } from '@chakra-ui/button'
import { Box, Flex } from '@chakra-ui/layout'
import { useTranslation } from 'react-i18next'
import { History } from 'history'
import { useURLSearchParams } from '../../hooks/useURLSearchParams'
import { FacilityURLSearchParamName } from '../../models/FacilityURLSearchParamName'

export const ResultPageSelector = ({
  pageItemCount,
  activeRowRange,
  facilityCount,
  history
}: {
  pageItemCount: number
  activeRowRange: [number, number]
  facilityCount: number
  history: History
}) => {
  const { t } = useTranslation()
  const urlSearchParams = useURLSearchParams()

  if (facilityCount < activeRowRange[1]) {
    return null
  }

  const newLowerLimits: [number, number] = [
    Math.max(0, activeRowRange[0] - pageItemCount),
    activeRowRange[0]
  ]
  const newUpperLimits: [number, number] = [
    activeRowRange[1],
    Math.min(activeRowRange[1] + pageItemCount, facilityCount)
  ]

  const updateActiveRowRage = (limits: [number, number]) => {
    urlSearchParams.set(
      FacilityURLSearchParamName.ActiveRangeLowerLimit,
      limits[0].toString()
    )
    urlSearchParams.set(
      FacilityURLSearchParamName.ActiveRangeUpperLimit,
      limits[1].toString()
    )
    history.push({
      pathname: '/facilities',
      search: '?' + urlSearchParams.toString()
    })
  }

  return (
    <Flex
      margin={1}
      marginTop={3}
      marginBottom={2}
      alignItems="center"
      wrap="wrap">
      <Box fontWeight="bold" marginRight={3} marginY={1.5}>
        {t('common.showingItems')} {activeRowRange[0] + 1}-{activeRowRange[1]} (
        {facilityCount})
      </Box>
      <ButtonGroup>
        {activeRowRange[1] > pageItemCount && (
          <Button
            colorScheme="blue"
            size="sm"
            onClick={() => updateActiveRowRage(newLowerLimits)}>
            {t('common.previousPage')}
          </Button>
        )}
        {activeRowRange[1] < facilityCount && (
          <Button
            colorScheme="blue"
            size="sm"
            onClick={() => updateActiveRowRage(newUpperLimits)}>
            {t('common.nextPage')}
          </Button>
        )}
      </ButtonGroup>
    </Flex>
  )
}
