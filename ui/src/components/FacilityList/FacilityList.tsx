import { Box, Button, Flex } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import * as api from '../../api'
import { LoadAnimation } from '../LoadAnimation/LoadAnimation'
import { FacilityQueryParams } from '../../api/models/FacilityQueryParams'
import { useURLSearchParam } from '../../hooks/useURLSearchParams'
import { FacilityURLSearchParamName } from '../../models/FacilityURLSearchParamName'
import { ResultPageSelector } from './ResultPageSelector'
import { FacilityListItem } from './FacilityListItem'
import { FacilitySearchPanel } from './FacilitySearchPanel'
import { FacilitySearchResultInfo } from './FacilitySearchResultInfo'
import { OlMap } from '../OlMap'
import { Facility } from '../../api/models/Facility'

const pageItemCount = 20

const getQueryParams = (
  urlSearchTerm: string | null
): FacilityQueryParams | undefined => {
  return urlSearchTerm
    ? {
        name_search_str: urlSearchTerm
      }
    : undefined
}

export const FacilityList = () => {
  const [listState, setListState] = useState<
    'initial' | 'loading' | 'error' | 'done'
  >('initial')
  const [facilities, seFacilities] = useState<Facility[] | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const history = useHistory()
  const urlSearchTerm = useURLSearchParam(FacilityURLSearchParamName.SearchTerm)
  const activeRangeLowerLimit =
    useURLSearchParam(FacilityURLSearchParamName.ActiveRangeLowerLimit) || '0'
  const activeRangeUpperLimit =
    useURLSearchParam(FacilityURLSearchParamName.ActiveRangeUpperLimit) ||
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
        const data = await api.getFacilities(controller, queryParams)
        seFacilities(data)
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
      return (
        <Box p={4} data-cy="facilities-load-animation">
          <LoadAnimation sizePx={30} />
        </Box>
      )
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
        <Flex
          maxWidth="100%"
          direction="column"
          align={{ base: 'center', lg: 'unset' }}>
          {!urlSearchTerm && (
            <FacilitySearchPanel
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              handleSubmit={setUrlSearchParam}
            />
          )}
          {facilities && (
            <>
              {!!urlSearchTerm && (
                <FacilitySearchResultInfo
                  urlSearchTerm={urlSearchTerm}
                  resultCount={facilities.length}
                  handleExitResults={() => {
                    if (urlSearchTerm) {
                      setListState('initial')
                    }
                    history.push('/facilities')
                  }}
                />
              )}
              <ResultPageSelector
                pageItemCount={pageItemCount}
                activeRowRange={activeRowRange}
                facilityCount={facilities.length}
                history={history}
              />
              <Flex wrap="wrap" justify="center" maxWidth="100%">
                <Box
                  data-cy="facility-list"
                  as="ul"
                  listStyleType="none"
                  boxSizing="border-box"
                  maxHeight={{ base: 'unset', md: '700px' }}
                  maxWidth="100%"
                  marginTop={1}
                  marginBottom={2}
                  overflowY={{ base: 'unset', md: 'auto' }}>
                  {facilities
                    .slice(activeRowRange[0], activeRowRange[1])
                    .map((f, idx) => (
                      <FacilityListItem
                        idx={idx}
                        key={f.facilityId}
                        f={f}
                        history={history}
                      />
                    ))}
                </Box>
                <Box px={{ base: 'unset', md: 2 }} maxWidth="100%">
                  <OlMap
                    facilities={facilities}
                    zoomToInitialExtent={!urlSearchTerm}
                  />
                </Box>
              </Flex>
            </>
          )}
        </Flex>
      )

    default:
      return null
  }
}
