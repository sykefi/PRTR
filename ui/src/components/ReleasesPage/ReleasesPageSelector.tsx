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
  totalItemCount,
  loading,
  setSearchStateLoading
}: {
  pageItemLimit: number
  firstItemIdx: number
  pageItemCount: number | undefined
  totalItemCount: number | undefined
  loading: boolean
  setSearchStateLoading: () => void
}) => {
  const { t } = useTranslation()
  const urlSearchParams = useURLSearchParams()
  const location = useLocation()
  const history = useHistory()

  const previousFirstIdx: number = Math.max(0, firstItemIdx - pageItemLimit)
  const nextFirstIdx: number = totalItemCount
    ? firstItemIdx + pageItemLimit < totalItemCount
      ? firstItemIdx + pageItemLimit
      : firstItemIdx
    : firstItemIdx

  const updateActiveRowRage = (newFirstIdx: number) => {
    setSearchStateLoading()
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
    firstItemIdx + (pageItemCount ? pageItemCount : pageItemLimit)

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
        {t('common.showingRows')} {firstItemIdx + 1}-{lastItemIdxToShow}
        {totalItemCount && ` (${totalItemCount})`}
      </Box>
      <ButtonGroup>
        {previousFirstIdx !== firstItemIdx && (
          <Button
            data-cy="previous-page-btn"
            colorScheme="blue"
            size="sm"
            disabled={loading}
            _disabled={{ cursor: 'default' }}
            onClick={() => updateActiveRowRage(previousFirstIdx)}>
            {t('common.previousPage')}
          </Button>
        )}
        {(nextFirstIdx !== firstItemIdx || loading) && (
          <Button
            data-cy="next-page-btn"
            colorScheme="blue"
            size="sm"
            disabled={loading}
            _disabled={{ cursor: 'default' }}
            onClick={() => updateActiveRowRage(nextFirstIdx)}>
            {t('common.nextPage')}
          </Button>
        )}
      </ButtonGroup>
    </Flex>
  )
}
