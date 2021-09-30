import { Box, Flex } from '@chakra-ui/layout'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import * as api from '../../api'
import * as env from '../../env'
import { Medium } from '../../api/models/Medium'
import { PollutantCode } from '../../api/models/PollutantCode'
import {
  useURLSearchParam,
  useURLSearchParamInt
} from '../../hooks/useURLSearchParams'
import { ReleaseSearchURLParamName } from '../../models/ReleaseSearchURLParamName'
import { BelowNavigationHeaderPanel } from '../Common'
import { ReleaseFilterPanel } from './ReleaseFilterPanel'
import { ReleasePageSelector } from './ReleasePageSelector'
import { ReleaseTable } from './ReleaseTable'

const pageItemLimit = 40

export const ReleaseSearch = (props: { medium: Medium }) => {
  const { t } = useTranslation()

  const urlPollutantCode = useURLSearchParam<PollutantCode>(
    ReleaseSearchURLParamName.PollutantCode
  )
  const urlFirstItemIdx = useURLSearchParamInt(
    ReleaseSearchURLParamName.FirstItemIdx
  )

  const { isLoading, isFetching, isError, isSuccess, data } = useQuery(
    ['releases', props.medium, urlPollutantCode, urlFirstItemIdx],
    async () => {
      if (urlFirstItemIdx === undefined) return undefined
      return await api.getReleases({
        pollutant_code: urlPollutantCode,
        medium: props.medium,
        skip: urlFirstItemIdx,
        limit: pageItemLimit
      })
    },
    { keepPreviousData: true, retry: 2, ...env.rqCacheSettings }
  )
  const loading = isLoading || isFetching
  const hasReleases = !!data && data.data.length > 0

  return (
    <>
      <BelowNavigationHeaderPanel>
        <ReleaseFilterPanel
          medium={props.medium}
          urlPollutantCode={urlPollutantCode}
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
              <ReleaseTable loading={loading} releases={data?.data || []} />
            )}
          </>
        )}
      </Flex>
    </>
  )
}
