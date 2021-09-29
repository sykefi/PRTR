import { Box, Flex } from '@chakra-ui/layout'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import * as api from '../../api'
import { Medium } from '../../api/models/Medium'
import { PollutantCode } from '../../api/models/PollutantCode'
import {
  useURLSearchParam,
  useURLSearchParamInt
} from '../../hooks/useURLSearchParams'
import { ReleaseSearchURLParamName } from '../../models/ReleaseSearchURLParamName'
import { BelowNavigationHeaderPanel } from '../Common'
import { LoadAnimation } from '../LoadAnimation/LoadAnimation'
import { ReleasesFilterPanel } from './ReleasesFilterPanel'
import { ReleasesPageSelector } from './ReleasesPageSelector'
import { ReleaseTable } from './ReleaseTable'

const pageItemLimit = 40

export const ReleasesSearch = (props: { medium: Medium }) => {
  const { t } = useTranslation()

  const urlPollutantCode = useURLSearchParam<PollutantCode>(
    ReleaseSearchURLParamName.PollutantCode
  )
  const urlFirstItemIdx = useURLSearchParamInt(
    ReleaseSearchURLParamName.FirstItemIdx
  )

  const { isLoading, isError, isSuccess, data } = useQuery(
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
    { keepPreviousData: true, staleTime: 60000 }
  )
  const hasReleases = !!data && data.data.length > 0

  return (
    <>
      <BelowNavigationHeaderPanel>
        <ReleasesFilterPanel
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
              <ReleasesPageSelector
                pageItemLimit={pageItemLimit}
                firstItemIdx={urlFirstItemIdx}
                totalItemCount={data.count}
                loading={isLoading}
              />
            )}
            {isLoading && (
              <Box p={2} data-cy="releases-load-animation">
                <LoadAnimation sizePx={30} />
              </Box>
            )}
            {isSuccess && !hasReleases && (
              <Box marginY={2.0} fontWeight="semibold">
                {t('releases.noReleasesFoundFromSearch')}
              </Box>
            )}
            {isError && (
              <Box marginY={2.0} fontWeight="semibold">
                {t('releases.releasesFetchErrorInfo')}
              </Box>
            )}
            {isSuccess && hasReleases && <ReleaseTable releases={data.data} />}
          </>
        )}
      </Flex>
    </>
  )
}
