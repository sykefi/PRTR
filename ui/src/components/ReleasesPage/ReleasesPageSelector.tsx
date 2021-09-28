import { useHistory, useLocation } from 'react-router'
import { Button, ButtonGroup } from '@chakra-ui/button'
import { Box, Flex } from '@chakra-ui/layout'
import { useTranslation } from 'react-i18next'
import { useURLSearchParams } from '../../hooks/useURLSearchParams'
import { ReleaseSearchURLParamName } from '../../models/ReleaseSearchURLParamName'

export const ReleasesPageSelector = ({
  pageItemLimit,
  firstItemIdx,
  pageItemCount,
  totalItemCount
}: {
  pageItemLimit: number
  firstItemIdx: number
  pageItemCount: number
  totalItemCount: number
}) => {
  const { t } = useTranslation()
  const urlSearchParams = useURLSearchParams()
  const location = useLocation()
  const history = useHistory()

  const previousFirstIdx: number = Math.max(0, firstItemIdx - pageItemLimit)
  const nextFirstIdx: number = Math.min(
    firstItemIdx + pageItemLimit,
    totalItemCount
  )

  const updateActiveRowRage = (newFirstIdx: number) => {
    urlSearchParams.set(
      ReleaseSearchURLParamName.FirstItemIdx,
      newFirstIdx.toString()
    )
    history.push({
      pathname: location.pathname,
      search: '?' + urlSearchParams.toString()
    })
  }

  const lastItemIdxToShow =
    firstItemIdx + (pageItemCount > 0 ? pageItemCount : pageItemLimit)

  return (
    <Flex
      data-cy="result-page-selector"
      margin={1}
      width="500px"
      maxWidth="100%"
      align="center"
      justify="center"
      wrap="wrap">
      <Box fontWeight="bold" marginRight={3} marginY={1.5}>
        {t('common.showingRows')} {firstItemIdx + 1}-{lastItemIdxToShow} (
        {totalItemCount})
      </Box>
      <ButtonGroup>
        {previousFirstIdx !== firstItemIdx && (
          <Button
            data-cy="previous-page-btn"
            colorScheme="blue"
            size="sm"
            onClick={() => updateActiveRowRage(previousFirstIdx)}>
            {t('common.previousPage')}
          </Button>
        )}
        {nextFirstIdx !== firstItemIdx && (
          <Button
            data-cy="next-page-btn"
            colorScheme="blue"
            size="sm"
            onClick={() => updateActiveRowRage(nextFirstIdx)}>
            {t('common.nextPage')}
          </Button>
        )}
      </ButtonGroup>
    </Flex>
  )
}
