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
import {
  useURLSearchParam,
  useURLSearchParamInt
} from '../../hooks/useURLSearchParams'
import { FacilityMainActivityCode } from '../../api/models/FacilityMainActivityCode'
import { FacilitySearchURLParamName } from '../../models/FacilitySearchURLParamName'
import { ResultPageSelector } from './ResultPageSelector'
import { FacilitySearchPanel } from './FacilitySearchPanel'
import { FacilitySearchResultInfo } from './FacilitySearchResultInfo'
import { FacilityList } from './FacilityList'

const pageItemLimit = 40

const getQueryParams = (
  urlSearchTerm: string | undefined,
  mainActivityCode: FacilityMainActivityCode | undefined
): FacilityQueryParams | undefined => {
  return {
    name_search_str: urlSearchTerm,
    main_activity_code: mainActivityCode
  }
}

export const FacilitiesSearch = () => {
  const [searchState, setSearchState] = useState<
    'initial' | 'loading' | 'error' | 'done'
  >('initial')
  const history = useHistory()
  const { t } = useTranslation()

  const [facilities, setFacilities] = useState<Facility[] | null>(null)

  const urlSearchTerm = useURLSearchParam(FacilitySearchURLParamName.SearchTerm)
  const urlFacilityMainActivityCode = useURLSearchParam(
    FacilitySearchURLParamName.FacilityMainActivityCode
  ) as FacilityMainActivityCode | undefined

  const urlFirstItemIdx =
    useURLSearchParamInt(FacilitySearchURLParamName.FirstItemIdx) || 0

  const showingSearchResults = !!urlSearchTerm || !!urlFacilityMainActivityCode

  const returnToMainList = () => {
    if (urlSearchTerm) {
      setSearchState('initial')
    }
    history.push('/facilities')
  }

  useEffect(() => {
    // fetch facilities after URL search parameters are changed
    const controller = new AbortController()
    const getFacilities = async () => {
      try {
        const data = await api.getFacilities(
          getQueryParams(urlSearchTerm, urlFacilityMainActivityCode),
          controller.signal
        )
        setFacilities(data)
        setSearchState('done')
      } catch (e) {
        if (!controller.signal.aborted) {
          console.error(e)
          setSearchState('error')
        }
      }
    }
    setSearchState('loading')
    getFacilities()

    return () => {
      setFacilities([])
      controller.abort()
    }
  }, [urlSearchTerm, urlFacilityMainActivityCode])

  if (searchState === 'initial' || searchState === 'loading') {
    return (
      <BelowNavigationHeaderPanel withYPadding>
        <Box data-cy="facilities-load-animation">
          <LoadAnimation sizePx={30} />
        </Box>
      </BelowNavigationHeaderPanel>
    )
  }

  if (searchState === 'error') {
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
            urlSearchTerm={urlSearchTerm}
            urlFacilityMainActivityCode={urlFacilityMainActivityCode}
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
                {facilities.length > 0 && (
                  <ResultPageSelector
                    pageItemLimit={pageItemLimit}
                    firstItemIdx={urlFirstItemIdx}
                    totalItemCount={facilities.length}
                    loading={false}
                  />
                )}
              </Flex>
              <Flex wrap="wrap" justify="center" maxWidth="100%">
                <FacilityList
                  facilities={facilities}
                  firstItemIdx={urlFirstItemIdx}
                  pageItemLimit={pageItemLimit}
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
