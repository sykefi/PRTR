import { Box, Flex } from '@chakra-ui/layout'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as api from '../../api'
import { Medium } from '../../api/models/Medium'
import { PollutantCode } from '../../api/models/PollutantCode'
import { PollutantRelease } from '../../api/models/PollutantRelease'
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
  const [searchState, setSearchState] = useState<
    'initial' | 'loading' | 'error' | 'done'
  >('initial')
  const [releases, setReleases] = useState<PollutantRelease[] | []>([])

  const { t } = useTranslation()

  const urlPollutantCode = useURLSearchParam<PollutantCode>(
    ReleaseSearchURLParamName.PollutantCode
  )
  const urlFirstItemIdx =
    useURLSearchParamInt(ReleaseSearchURLParamName.FirstItemIdx) || 0

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
        setReleases(body.data)
        setSearchState('done')
      } catch (e) {
        if (!controller.signal.aborted) {
          console.error(e)
          setSearchState('error')
        }
      }
    }
    setSearchState('loading')
    getReleases()

    return () => {
      setReleases([])
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
        {(searchState === 'loading' ||
          searchState === 'error' ||
          releases.length > 0) && (
          <ReleasesPageSelector
            pageItemLimit={pageItemLimit}
            firstItemIdx={urlFirstItemIdx}
            pageItemCount={releases.length}
            totalItemCount={500}
          />
        )}
        {(searchState === 'loading' || searchState === 'initial') && (
          <Box p={2} data-cy="releases-load-animation">
            <LoadAnimation sizePx={30} />
          </Box>
        )}
        {searchState === 'done' && releases.length === 0 && (
          <Box marginY={2.0} fontWeight="semibold">
            {t('releases.noReleasesFoundFromSearch')}
          </Box>
        )}
        {searchState === 'error' && (
          <Box marginY={2.0} fontWeight="semibold">
            {t('releases.releasesFetchErrorInfo')}
          </Box>
        )}
        {releases.length > 0 && <ReleaseTable releases={releases} />}
      </Flex>
    </>
  )
}
