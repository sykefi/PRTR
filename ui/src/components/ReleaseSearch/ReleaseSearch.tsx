import { useState } from 'react'
import { Box, Flex } from '@chakra-ui/layout'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import * as api from '../../api'
import * as env from '../../env'
import { Medium } from '../../api/enums/Medium'
import { PollutantCodeAir, PollutantCodeWater } from '../../api/enums/PollutantCode'
import {
  useURLSearchParam,
  useURLSearchParamArray,
  useURLSearchParamInt,
  useURLSearchParamIntArray
} from '../../hooks/useURLSearchParams'
import { URLSearchParamName } from '../../models/URLSearchParamName'
import { SearchInfo } from '../Common/SearchInfo'
import { BelowNavigationHeaderPanel } from '../Common/BelowNavigationHeaderPanel'
import { ReleaseFilterPanel } from './ReleaseFilterPanel'
import { ReleasePageSelector } from './ReleasePageSelector'
import { ReleaseTable } from './ReleaseTable'

const pageItemLimit = 20

export const ReleaseSearch = (props: { medium: Medium }) => {
  const { t } = useTranslation()

  const urlPollutantCode = useURLSearchParamArray<PollutantCodeAir | PollutantCodeWater>(
    URLSearchParamName.PollutantCode
  )
  const urlFirstItemIdx = useURLSearchParamInt(URLSearchParamName.FirstItemIdx)
  const urlYear = useURLSearchParamIntArray(URLSearchParamName.Year)
  const urlPlacename = useURLSearchParamArray(URLSearchParamName.Placename)
  const [sort, setSort] = useState<{sortKey: string; descending: boolean}>({sortKey: "", descending: false})

  const { isLoading, isFetching, isError, isSuccess, data } = useQuery(
    [
      'releases',
      props.medium,
      urlPollutantCode,
      urlFirstItemIdx,
      urlYear,
      urlPlacename,
      sort.sortKey,
      sort.descending
    ],
    async () => {
      if (urlFirstItemIdx === undefined) return undefined
      return await api.getReleases({
        pollutant_code: urlPollutantCode,
        medium: props.medium,
        reporting_year: urlYear,
        placename: urlPlacename,
        skip: urlFirstItemIdx,
        limit: pageItemLimit,
        sort_key: sort.sortKey,
        descending: sort.descending
      })
    },
    { keepPreviousData: true, retry: 2, ...env.rqCacheSettings }
  )
  const loading = isLoading || isFetching
  const hasReleases = !!data && data.data.length > 0

  const updateSortKey = (newSortKey: string, newDescending: boolean) => {
    newDescending = !newDescending
    setSort({sortKey: newSortKey, descending: newDescending})
  }

  return (
    <>
      <BelowNavigationHeaderPanel>
        <SearchInfo
          textKey={
            props.medium === Medium.AIR
              ? 'descriptions.emissionsToAir'
              : 'descriptions.emissionsToWater'
          }
        />
        <ReleaseFilterPanel
          medium={props.medium}
          urlPollutantCode={urlPollutantCode}
          urlYear={urlYear}
          urlPlacename={urlPlacename}
          updateSortKey={updateSortKey}
        />
      </BelowNavigationHeaderPanel>
      <Flex
        wrap="wrap"
        align="center"
        direction="column"
        maxWidth="100%"
        sx={{ gap: 'var(--chakra-space-3)' }}
        padding={3}
        data-cy="releases-container">
        {urlFirstItemIdx !== undefined && (
          <>
            {hasReleases && (
              <ReleasePageSelector
                pageItemLimit={pageItemLimit}
                firstItemIdx={urlFirstItemIdx}
                totalItemCount={data.count}
                loading={loading}
              />
            )}
            {!loading && isSuccess && !hasReleases && (
              <Box marginY={2.0} fontWeight="semibold">
                {t('releases.noReleasesFoundFromSearch')}
              </Box>
            )}
            {!loading && isError && (
              <Box marginY={2.0} fontWeight="semibold">
                {t('releases.releasesFetchErrorInfo')}
              </Box>
            )}
            {(loading || (isSuccess && hasReleases)) && (
              <ReleaseTable loading={loading} releases={data?.data || []} updateSortKey={updateSortKey} sort={sort} />
            )}
          </>
        )}
      </Flex>
    </>
  )
}
