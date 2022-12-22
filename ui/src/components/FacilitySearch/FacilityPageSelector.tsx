import { useHistory, useLocation } from 'react-router-dom'
import { Button, ButtonGroup } from '@chakra-ui/button'
import { Box, Flex } from '@chakra-ui/layout'
import { useTranslation } from 'react-i18next'
import { useURLSearchParams } from '../../hooks/useURLSearchParams'
import { URLSearchParamName } from '../../models/URLSearchParamName'
import { FacilityMainActivityCode } from '../../api/enums/FacilityMainActivityCode'
import { FacilityTopMainActivity } from '../../api/enums/FacilityTopMainActivity'
import { CSVDownloadFacilitiesButton } from './CSVDownloadFacilitiesButton'

export const FacilityPageSelector = ({
  pageItemLimit,
  firstItemIdx,
  totalItemCount,
  loading,
  urlSearchTerm,
  urlFacilityMainActivity,
  urlPlacename
}: {
  pageItemLimit: number
  firstItemIdx: number
  totalItemCount: number
  loading: boolean
  urlSearchTerm: string | undefined
  urlFacilityMainActivity: | (FacilityMainActivityCode | FacilityTopMainActivity)[] | undefined
  urlPlacename: string[] | undefined
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
      marginTop={1}
      marginBottom={3.5}
      width="500px"
      maxWidth="100%"
      align="center"
      justify="center"
      wrap="wrap">
      <Box fontWeight="bold" marginRight={3} marginY={2}>
        {t('common.showingItems')} {firstItemIdx + 1}-{lastItemIdxToShow}
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
          <CSVDownloadFacilitiesButton
            urlSearchTerm={urlSearchTerm}
            urlFacilityMainActivity={urlFacilityMainActivity}
            urlPlacename={urlPlacename}
          />
      </ButtonGroup>
    </Flex>
  )
}
