import { Box, Button, Flex } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import * as api from '../../api'
import { Facility } from '../../api/models/Facility'
import { BelowNavigationHeaderPanel } from '../Common'
import { LoadAnimation } from '../LoadAnimation/LoadAnimation'
import { FacilityQueryParams } from '../../api/models/FacilityQueryParams'
import { OlMap } from '../OlMap'
import { useURLSearchParam } from '../../hooks/useURLSearchParams'
import { FacilityMainActivityCode } from '../../api/models/FacilityMainActivityCode'
import { FacilityURLSearchParamName } from '../../models/FacilityURLSearchParamName'
import { ResultPageSelector } from './ResultPageSelector'
import { FacilitySearchPanel } from './FacilitySearchPanel'
import { FacilitySearchResultInfo } from './FacilitySearchResultInfo'
import { FacilityList } from './FacilityList'

const pageItemCount = 20

const getQueryParams = (
  urlSearchTerm: string | undefined,
  mainActivityCode: FacilityMainActivityCode | undefined
): FacilityQueryParams | undefined => {
  return {
    name_search_str: urlSearchTerm,
    main_activity_code: mainActivityCode
  }
}

export const FacilitiesPage = () => {
  const [listState, setListState] = useState<
    'initial' | 'loading' | 'error' | 'done'
  >('initial')
  const history = useHistory()
  const { t } = useTranslation()

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

  const activeRowRange = [
    urlActiveRangeLowerLimit,
    urlActiveRangeUpperLimit
  ].map(v => parseInt(v)) as [number, number]

  const showingSearchResults = !!urlSearchTerm || !!urlFacilityMainActivityCode

  const returnToMainList = () => {
    if (urlSearchTerm) {
      setListState('initial')
    }
    history.push('/facilities')
  }

  /**
   * Resets current URL search parameters (including active row ranges)
   * and sets new ones (if some of them changed). This will trigger
   * the facility list update.
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
    // fetch facilities after URL search parameters are changed
    console.log(
      'update facility list with query params:',
      urlSearchTerm,
      urlFacilityMainActivityCode
    )
    // we need to reset the form state when user navigates back to search
    !urlFacilityMainActivityCode && setFacilityMainActivityCode(undefined)
    !urlSearchTerm && setSearchTerm(undefined)

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

  if (listState === 'initial' || listState === 'loading') {
    return (
      <BelowNavigationHeaderPanel withYPadding>
        <Box data-cy="facilities-load-animation">
          <LoadAnimation sizePx={30} />
        </Box>
      </BelowNavigationHeaderPanel>
    )
  }

  if (listState === 'error') {
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
  }

  return (
    <>
      {!showingSearchResults && (
        <BelowNavigationHeaderPanel>
          <FacilitySearchPanel
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            facilityMainActivityCode={facilityMainActivityCode}
            setFacilityMainActivityCode={setFacilityMainActivityCode}
            handleSubmit={setUrlSearchParams}
          />
        </BelowNavigationHeaderPanel>
      )}
      {facilities && showingSearchResults && (
        <BelowNavigationHeaderPanel withYPadding>
          <FacilitySearchResultInfo
            urlSearchTerm={urlSearchTerm}
            resultCount={facilities.length}
            handleExitResults={returnToMainList}
          />
        </BelowNavigationHeaderPanel>
      )}
      <Flex direction="column" maxWidth="100%" align="center">
        <Flex
          maxWidth="100%"
          direction="column"
          p={{ base: 3, md: 4 }}
          display="inline-flex"
          width="fit-content"
          flexWrap="wrap"
          justify="center"
          align="center">
          {facilities && (
            <>
              <Flex justify={{ base: 'center', lg: 'flex-start' }} width="100%">
                <ResultPageSelector
                  pageItemCount={pageItemCount}
                  activeRowRange={activeRowRange}
                  facilityCount={facilities.length}
                  history={history}
                />
              </Flex>
              <Flex wrap="wrap" justify="center" maxWidth="100%">
                <FacilityList
                  facilities={facilities}
                  activeRowRange={activeRowRange}
                  handleExitResults={returnToMainList}
                />
                <Box px={{ base: 'unset', md: 2 }} m={1} maxWidth="100%">
                  <OlMap
                    facilities={facilities}
                    zoomToInitialExtent={!urlSearchTerm}
                  />
                </Box>
              </Flex>
            </>
          )}
        </Flex>
      </Flex>
    </>
  )
}
