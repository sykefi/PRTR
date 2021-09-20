import { Box, Button, Flex } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import * as api from '../../api'
import { Facility } from '../../api/models/Facility'
import { LoadAnimation } from '../LoadAnimation/LoadAnimation'
import { FacilityQueryParams } from '../../api/models/FacilityQueryParams'
import { OlMap } from '../OlMap'
import { useURLSearchParam } from '../../hooks/useURLSearchParams'
import { FacilityMainActivityCode } from '../../models/FacilityMainActivityCode'
import { FacilityURLSearchParamName } from '../../models/FacilityURLSearchParamName'
import { ResultPageSelector } from './ResultPageSelector'
import { FacilityListItem } from './FacilityListItem'
import { FacilitySearchPanel } from './FacilitySearchPanel'
import { FacilitySearchResultInfo } from './FacilitySearchResultInfo'

const pageItemCount = 20

const getQueryParams = (
  urlSearchTerm: string | undefined,
  mainActivityCode: string | undefined
): FacilityQueryParams | undefined => {
  return {
    name_search_str: urlSearchTerm,
    main_activity_code: mainActivityCode
  }
}

export const FacilityList = () => {
  const [listState, setListState] = useState<
    'initial' | 'loading' | 'error' | 'done'
  >('initial')
  const urlSearchTerm = useURLSearchParam(FacilityURLSearchParamName.SearchTerm)
  const urlFacilityMainActivityCode = useURLSearchParam(
    FacilityURLSearchParamName.FacilityMainActivityCode
  ) as FacilityMainActivityCode | undefined
  const urlActiveRangeLowerLimit =
    useURLSearchParam(FacilityURLSearchParamName.ActiveRangeLowerLimit) || '0'
  const urlActiveRangeUpperLimit =
    useURLSearchParam(FacilityURLSearchParamName.ActiveRangeUpperLimit) ||
    pageItemCount.toString()

  const [facilities, seFacilities] = useState<Facility[] | null>(null)
  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined)
  const [facilityMainActivityCode, setFacilityMainActivityCode] = useState<
    FacilityMainActivityCode | undefined
  >(undefined)
  const history = useHistory()

  const activeRowRange = [
    urlActiveRangeLowerLimit,
    urlActiveRangeUpperLimit
  ].map(v => parseInt(v)) as [number, number]

  const showingSearchResults = !!urlSearchTerm || !!urlFacilityMainActivityCode

  const { t } = useTranslation()

  /**
   * Resets current URL search parameters (including active row ranges)
   * and sets new ones. This will trigger the facility list update.
   */
  const setUrlSearchParams = () => {
    if (
      urlSearchTerm !== searchTerm ||
      urlFacilityMainActivityCode !== facilityMainActivityCode
    ) {
      setListState('loading')
    } else {
      return
    }
    const newUrlSearchParams = new URLSearchParams()
    if (searchTerm)
      newUrlSearchParams.set(FacilityURLSearchParamName.SearchTerm, searchTerm)
    if (facilityMainActivityCode) {
      newUrlSearchParams.set(
        FacilityURLSearchParamName.FacilityMainActivityCode,
        facilityMainActivityCode
      )
    }
    history.push({
      pathname: '/facilities',
      search: '?' + newUrlSearchParams.toString()
    })
  }

  useEffect(() => {
    console.log('update facility list, params:', urlSearchTerm)
    const controller = new AbortController()
    const getFacilities = async () => {
      try {
        const data = await api.getFacilities(
          controller,
          getQueryParams(urlSearchTerm, urlFacilityMainActivityCode)
        )
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
  }, [urlSearchTerm, urlFacilityMainActivityCode])

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
          {!showingSearchResults && (
            <FacilitySearchPanel
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              facilityMainActivityCode={facilityMainActivityCode}
              setFacilityMainActivityCode={setFacilityMainActivityCode}
              handleSubmit={setUrlSearchParams}
            />
          )}
          {facilities && (
            <>
              {showingSearchResults && (
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
