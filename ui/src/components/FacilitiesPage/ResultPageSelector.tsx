import { Button, ButtonGroup } from '@chakra-ui/button'
import { Box, Flex } from '@chakra-ui/layout'
import { useTranslation } from 'react-i18next'
import { History } from 'history'
import { useURLSearchParams } from '../../hooks/useURLSearchParams'
import { FacilitySearchURLParamName } from '../../models/FacilitySearchURLParamName'

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
      FacilitySearchURLParamName.ActiveRangeLowerLimit,
      limits[0].toString()
    )
    urlSearchParams.set(
      FacilitySearchURLParamName.ActiveRangeUpperLimit,
      limits[1].toString()
    )
    history.push({
      pathname: '/facilities',
      search: '?' + urlSearchParams.toString()
    })
  }

  return (
    <Flex
      data-cy="result-page-selector"
      margin={1}
      marginTop={3}
      marginBottom={2}
      width="500px"
      maxWidth="100%"
      align="center"
      justify="center"
      wrap="wrap">
      <Box fontWeight="bold" marginRight={3} marginY={1.5}>
        {t('common.showingItems')} {activeRowRange[0] + 1}-{activeRowRange[1]} (
        {facilityCount})
      </Box>
      <ButtonGroup>
        {activeRowRange[1] > pageItemCount && (
          <Button
            data-cy="previous-page-btn"
            colorScheme="blue"
            size="sm"
            onClick={() => updateActiveRowRage(newLowerLimits)}>
            {t('common.previousPage')}
          </Button>
        )}
        {activeRowRange[1] < facilityCount && (
          <Button
            data-cy="next-page-btn"
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
