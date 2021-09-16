import { Box, Flex, Input, Button, ButtonGroup } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory, useLocation } from 'react-router-dom'
import { History } from 'history'
import * as api from '../api'
import { Facility } from '../api/models/Facility'
import { SolidLoadAnimation } from './LoadAnimation/LoadAnimation'
import { FacilityQueryParams } from '../api/models/FacilityQueryParams'

const pageItemCount = 20

enum URLSearchParamName {
  SearchTerm = 'searchTerm',
  ActiveRangeLowerLimit = 'listLowerLimit',
  ActiveRangeUpperLimit = 'listUpperLimit'
}

const FacilityBox = ({ f, history }: { f: Facility; history: History }) => {
  const { t } = useTranslation()

  return (
    <li>
      <Box
        bg="white"
        as="button"
        borderRadius="md"
        boxShadow="sm"
        paddingX={3}
        paddingY={1.5}
        textAlign="left"
        marginY={1.0}
        width="100%"
        maxWidth="500px"
        onClick={() => history.push('/facilities/' + f.facilityId)}>
        <Box fontWeight="semibold" as="h4" lineHeight="tight" isTruncated>
          {f.nameOfFeature}
        </Box>
        <Flex>
          <Box fontSize="smaller" marginRight={2}>
            {t('common.facilityTypeCode')}: {f.mainActivityCode}
          </Box>
          <Box fontSize="smaller">
            {t('common.municipality')}: {f.city}
          </Box>
        </Flex>
      </Box>
    </li>
  )
}

const useURLSearchParams = (): URLSearchParams => {
  return new URLSearchParams(useLocation().search)
}

const useURLSearchParam = (name: string): string | null => {
  return useURLSearchParams().get(name)
}

const getQueryParams = (
  urlSearchTerm: string | null
): FacilityQueryParams | undefined => {
  return urlSearchTerm
    ? {
        name_search_str: urlSearchTerm
      }
    : undefined
}

const ResultPageSelector = ({
  activeRowRange,
  facilityCount,
  history
}: {
  activeRowRange: [number, number]
  facilityCount: number
  history: History
}) => {
  const { t } = useTranslation()
  const urlSearchParams = useURLSearchParams()

  if (facilityCount < activeRowRange[1]) {
    return null
  }

  const newLowerLimits: [number, number] = [
    Math.max(0, activeRowRange[0] - pageItemCount),
    activeRowRange[0]
  ]
  const newUpperLimits: [number, number] = [
    activeRowRange[1],
    Math.min(activeRowRange[1] + pageItemCount, facilityCount)
  ]

  const updateActiveRowRage = (limits: [number, number]) => {
    urlSearchParams.set(
      URLSearchParamName.ActiveRangeLowerLimit,
      limits[0].toString()
    )
    urlSearchParams.set(
      URLSearchParamName.ActiveRangeUpperLimit,
      limits[1].toString()
    )
    history.push({
      pathname: '/facilities',
      search: '?' + urlSearchParams.toString()
    })
  }

  return (
    <Flex margin={1.0} marginTop={6.0} marginBottom={2.0} alignItems="center">
      <Box fontWeight="bold" marginRight={3}>
        {t('common.showingItems')} {activeRowRange[0] + 1}-{activeRowRange[1]} (
        {facilityCount})
      </Box>
      <ButtonGroup>
        {activeRowRange[1] > pageItemCount && (
          <Button
            colorScheme="blue"
            size="sm"
            onClick={() => updateActiveRowRage(newLowerLimits)}>
            {t('common.previousPage')}
          </Button>
        )}
        {activeRowRange[1] < facilityCount && (
          <Button
            colorScheme="blue"
            size="sm"
            onClick={() => updateActiveRowRage(newUpperLimits)}>
            {t('common.nextPage')}
          </Button>
        )}
      </ButtonGroup>
    </Flex>
  )
}

export const FacilityList = () => {
  const [listState, setListState] = useState<
    'initial' | 'loading' | 'error' | 'done'
  >('initial')
  const [facilities, setFacilities] = useState<Facility[] | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const history = useHistory()
  const urlSearchTerm = useURLSearchParam(URLSearchParamName.SearchTerm)
  const activeRangeLowerLimit =
    useURLSearchParam(URLSearchParamName.ActiveRangeLowerLimit) || '0'
  const activeRangeUpperLimit =
    useURLSearchParam(URLSearchParamName.ActiveRangeUpperLimit) ||
    pageItemCount.toString()

  const activeRowRange = [activeRangeLowerLimit, activeRangeUpperLimit].map(v =>
    parseInt(v)
  ) as [number, number]

  const { t } = useTranslation()

  const setUrlSearchParam = () => {
    if (urlSearchTerm !== searchTerm) {
      setListState('loading')
    }
    if (!!searchTerm) {
      const urlParams = new URLSearchParams()
      urlParams.set('searchTerm', searchTerm)
      history.push({
        pathname: '/facilities',
        search: '?' + urlParams.toString()
      })
    }
  }

  useEffect(() => {
    console.log('update facility list, params:', urlSearchTerm)
    const controller = new AbortController()
    const queryParams = getQueryParams(urlSearchTerm)
    const getFacilities = async () => {
      try {
        const facilities = await api.getFacilities(controller, queryParams)
        setFacilities(facilities)
        setListState('done')
      } catch (e) {
        if (!controller.signal.aborted) {
          console.error(e)
          setListState('error')
        }
      }
    }
    setListState('loading')
    getFacilities()

    return () => {
      controller.abort()
    }
  }, [urlSearchTerm])

  switch (listState) {
    case 'initial':
    case 'loading':
      return <SolidLoadAnimation sizePx={25} />

    case 'error':
      return (
        <Box margin={1.0} marginY={2.0} fontWeight="bold">
          <Box>
            {t('facilities.loadFacilitiesErroredText', {
              searchTerm: urlSearchTerm,
              resultCount: facilities ? facilities.length : 0
            })}
          </Box>
          <Box>
            <Button
              marginY={2.0}
              size="sm"
              colorScheme="blue"
              onClick={() => history.push('/')}>
              {t('common.goBack')}
            </Button>
          </Box>
        </Box>
      )

    case 'done':
      return (
        <>
          {(!urlSearchTerm && ( // show search input(s) & button
            <form onSubmit={setUrlSearchParam}>
              <Flex marginTop={1.0} marginBottom={2.0} flexWrap="wrap">
                <Input
                  type="text"
                  bgColor="white"
                  width={438}
                  minWidth={300}
                  marginY={1.0}
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder={t('common.searchTerm')}
                />
                <Button
                  type="submit"
                  marginY={1.0}
                  marginLeft={1.0}
                  disabled={searchTerm === ''}
                  colorScheme="green">
                  {t('common.search')}
                </Button>
              </Flex>
            </form>
          )) || // or show search result info & reset search button
            (facilities && (
              <Box>
                <Box margin={1.0} marginBottom={2.0} fontWeight="bold">
                  {t('common.facilitySearchResult', {
                    searchTerm: urlSearchTerm,
                    resultCount: facilities ? facilities.length : 0
                  })}
                </Box>
                <Box>
                  <Button
                    marginTop={2.0}
                    marginBottom={2.0}
                    size="sm"
                    colorScheme="orange"
                    onClick={() => {
                      if (urlSearchTerm) {
                        setListState('initial')
                      }
                      history.push('/facilities')
                    }}>
                    {t('common.goBack')}
                  </Button>
                </Box>
              </Box>
            ))}

          {facilities && (
            <>
              <ResultPageSelector
                activeRowRange={activeRowRange}
                facilityCount={facilities ? facilities.length : 0}
                history={history}
              />
              <Box as="ul" listStyleType="none" boxSizing="border-box">
                {facilities
                  .slice(activeRowRange[0], activeRowRange[1])
                  .map(f => (
                    <FacilityBox key={f.facilityId} f={f} history={history} />
                  ))}
              </Box>
            </>
          )}
        </>
      )

    default:
      return null
  }
}
