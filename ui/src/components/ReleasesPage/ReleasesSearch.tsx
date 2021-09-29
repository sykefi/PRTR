import { Box, Flex } from '@chakra-ui/layout'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as api from '../../api'
import { Medium } from '../../api/models/Medium'
import { PollutantCode } from '../../api/models/PollutantCode'
import { PollutantRelease } from '../../api/models/PollutantRelease'
import { PRTRListResponse } from '../../api/models/PRTRListResponse'
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
  const [searchState, setSearchState] = useState<'loading' | 'error' | 'done'>(
    'loading'
  )
  const { t } = useTranslation()

  const [releasesData, setReleasesData] =
    useState<PRTRListResponse<PollutantRelease> | null>(null)
  const hasReleases = !!releasesData && releasesData.data.length > 0

  const urlPollutantCode = useURLSearchParam<PollutantCode>(
    ReleaseSearchURLParamName.PollutantCode
  )
  const urlFirstItemIdx =
    useURLSearchParamInt(ReleaseSearchURLParamName.FirstItemIdx) || 0

  useEffect(() => {
    // clear old data if a search param other than active page changed
    return () => {
      setReleasesData(null)
    }
  }, [props.medium, urlPollutantCode])

  useEffect(() => {
    const controller = new AbortController()
    const getReleases = async () => {
      try {
        const body = await api.getReleases(controller, {
          pollutant_code: urlPollutantCode,
          medium: props.medium,
          skip: urlFirstItemIdx,
          limit: pageItemLimit
        })
        setReleasesData(body)
        setSearchState('done')
      } catch (e) {
        if (!controller.signal.aborted) {
          console.error(e)
          setSearchState('error')
          setReleasesData(null)
        }
      }
    }
    setSearchState('loading')
    getReleases()

    return () => {
      controller.abort()
    }
  }, [props.medium, urlPollutantCode, urlFirstItemIdx])

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
        {hasReleases && (
          <ReleasesPageSelector
            pageItemLimit={pageItemLimit}
            firstItemIdx={urlFirstItemIdx}
            totalItemCount={releasesData.count}
            loading={searchState === 'loading'}
          />
        )}
        {searchState === 'loading' && (
          <Box p={2} data-cy="releases-load-animation">
            <LoadAnimation sizePx={30} />
          </Box>
        )}
        {searchState === 'done' && !hasReleases && (
          <Box marginY={2.0} fontWeight="semibold">
            {t('releases.noReleasesFoundFromSearch')}
          </Box>
        )}
        {searchState === 'error' && (
          <Box marginY={2.0} fontWeight="semibold">
            {t('releases.releasesFetchErrorInfo')}
          </Box>
        )}
        {searchState === 'done' && hasReleases && (
          <ReleaseTable releases={releasesData.data} />
        )}
      </Flex>
    </>
  )
}
