import { Flex } from '@chakra-ui/layout'
import { useEffect, useState } from 'react'
import * as api from '../../api'
import { Medium } from '../../api/models/Medium'
import { PollutantCode } from '../../api/models/PollutantCode'
import { PollutantRelease } from '../../api/models/PollutantRelease'
import { useURLSearchParam } from '../../hooks/useURLSearchParams'
import { ReleaseSearchURLParamName } from '../../models/ReleaseSearchURLParamName'
import { BelowNavigationHeaderPanel } from '../Common'
import { ReleasesFilterPanel } from './ReleasesFilterPanel'
import { ReleaseTable } from './ReleaseTable'

export const ReleasesSearch = (props: { medium: Medium }) => {
  const [searchState, setSearchState] = useState<
    'initial' | 'loading' | 'error' | 'done'
  >('initial')
  const [releases, setReleases] = useState<PollutantRelease[] | []>([])

  const urlPollutantCode = useURLSearchParam<PollutantCode>(
    ReleaseSearchURLParamName.PollutantCode
  )

  useEffect(() => {
    const controller = new AbortController()

    const getReleases = async () => {
      try {
        const data = await api.getReleases(controller, {
          pollutant_code: urlPollutantCode,
          medium: props.medium,
          limit: 50
        })
        setReleases(data)
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
      controller.abort()
    }
  }, [urlPollutantCode])

  return (
    <>
      <BelowNavigationHeaderPanel>
        <ReleasesFilterPanel />
      </BelowNavigationHeaderPanel>
      <Flex
        wrap="wrap"
        justify="center"
        maxWidth="100%"
        sx={{ gap: 'var(--chakra-space-3)' }}
        padding={3}
        data-cy="releases-container">
        {releases.length > 0 && <ReleaseTable releases={releases} />}
      </Flex>
    </>
  )
}
