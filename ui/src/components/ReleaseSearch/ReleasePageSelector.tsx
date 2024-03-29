import { useHistory, useLocation } from 'react-router-dom'
import { Button, ButtonGroup } from '@chakra-ui/button'
import { Box, Flex } from '@chakra-ui/layout'
import { useTranslation } from 'react-i18next'
import { useURLSearchParams } from '../../hooks/useURLSearchParams'
import { URLSearchParamName } from '../../models/URLSearchParamName'
import {
  PollutantCodeAir,
  PollutantCodeWater
} from '../../api/enums/PollutantCode'
import { Medium } from '../../api/enums/Medium'
import { CSVDownloadReleasesButton } from './CSVDownloadReleasesButton'

export const ReleasePageSelector = ({
  pageItemLimit,
  firstItemIdx,
  totalItemCount,
  loading,
  medium,
  urlPollutantCode,
  urlYear,
  urlPlacename,
  sort
}: {
  pageItemLimit: number
  firstItemIdx: number
  totalItemCount: number
  loading: boolean
  medium: Medium
  urlPollutantCode: (PollutantCodeAir | PollutantCodeWater)[] | undefined
  urlYear: number[] | undefined
  urlPlacename: string[] | undefined
  sort: { sortKey: string; descending: boolean }
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

  const updateFirstItemIdx = (newFirstIdx: number) => {
    urlSearchParams.set(URLSearchParamName.FirstItemIdx, newFirstIdx.toString())
    history.push({
      pathname: location.pathname,
      search: '?' + urlSearchParams.toString()
    })
  }

  const computedPageItemCount =
    firstItemIdx + pageItemLimit < totalItemCount
      ? pageItemLimit
      : totalItemCount - firstItemIdx

  const lastItemIdxToShow = firstItemIdx + computedPageItemCount

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
            onClick={() => updateFirstItemIdx(previousFirstIdx)}>
            {t('common.previousPage')}
          </Button>
        )}
        {nextFirstIdx !== firstItemIdx && (
          <Button
            data-cy="next-page-btn"
            colorScheme="blue"
            size="sm"
            disabled={loading}
            _disabled={{ cursor: 'default' }}
            onClick={() => updateFirstItemIdx(nextFirstIdx)}>
            {t('common.nextPage')}
          </Button>
        )}
          <CSVDownloadReleasesButton
            medium={medium}
            urlPollutantCode={urlPollutantCode}
            urlYear={urlYear}
            urlPlacename={urlPlacename}
            sort={sort}
            />
      </ButtonGroup>
    </Flex>
  )
}
