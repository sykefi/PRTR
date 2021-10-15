import { Box, Flex } from '@chakra-ui/react'
import { useQuery } from 'react-query'
import { useTranslation } from 'react-i18next'
import * as api from '../../api'
import * as env from '../../env'
import { BelowNavigationHeaderPanel } from '../Common/BelowNavigationHeaderPanel'
import { LoadAnimation } from '../LoadAnimation/LoadAnimation'
import { OlMap } from '../OlMap'
import {
  useURLSearchParam,
  useURLSearchParamInt
} from '../../hooks/useURLSearchParams'
import { hasCoordinates } from '../../api/models/Facility'
import { FacilityTopMainActivity } from '../../api/enums/FacilityTopMainActivity'
import { FacilityMainActivityCode } from '../../api/enums/FacilityMainActivityCode'
import { URLSearchParamName } from '../../models/URLSearchParamName'
import { SearchInfo } from '../Common/SearchInfo'
import { FacilityMapLegend } from '../FacilityMapLegend'
import { FacilityPageSelector } from './FacilityPageSelector'
import { FacilityFilterPanel } from './FacilityFilterPanel'
import { FacilityList } from './FacilityList'

const pageItemLimit = 20

export const FacilitySearch = () => {
  const { t } = useTranslation()

  const urlSearchTerm = useURLSearchParam(URLSearchParamName.SearchTerm)
  const urlPlacename = useURLSearchParam(URLSearchParamName.Placename)
  const urlFacilityMainActivity = useURLSearchParam(
    URLSearchParamName.FacilityMainActivity
  ) as FacilityTopMainActivity | FacilityMainActivityCode | undefined

  const urlFirstItemIdx = useURLSearchParamInt(URLSearchParamName.FirstItemIdx)
  const searchHasBeenMade = urlFirstItemIdx !== undefined

  const { isLoading, isError, isSuccess, data } = useQuery(
    ['facilities', urlSearchTerm, urlPlacename, urlFacilityMainActivity],
    async () => {
      return api.getFacilities({
        name_search_str: urlSearchTerm,
        main_activity: urlFacilityMainActivity,
        placename: urlPlacename
      })
    },
    {
      retry: false,
      ...env.rqCacheSettings
    }
  )
  const gotFacilities = !!data && data.length > 0
  const facilitiesWithCoordinates = data ? data.filter(hasCoordinates) : []

  return (
    <>
      <BelowNavigationHeaderPanel>
        <SearchInfo textKey={'descriptions.Facilities'} />
        <FacilityFilterPanel
          searchHasBeenMade={searchHasBeenMade}
          urlSearchTerm={urlSearchTerm}
          urlPlacename={urlPlacename}
          urlFacilityMainActivity={urlFacilityMainActivity}
        />
      </BelowNavigationHeaderPanel>

      <Flex direction="column" maxWidth="100%" align="center">
        {isError && (
          <Flex
            margin={5.0}
            align="center"
            direction="column"
            fontWeight="bold">
            {t('facilities.loadFacilitiesErroredText', {
              searchTerm: urlSearchTerm,
              resultCount: data ? data.length : 0
            })}
          </Flex>
        )}
        {isLoading && (
          <Box m={5} data-cy="facilities-load-animation">
            <LoadAnimation sizePx={30} />
          </Box>
        )}
        <Flex
          maxWidth="100%"
          direction="column"
          p={{ base: 3, md: 4 }}
          display="inline-flex"
          width="fit-content"
          wrap="wrap"
          justify="center"
          align="center">
          {gotFacilities && (
            <>
              <Flex
                wrap="wrap"
                direction="column"
                justify="center"
                align="center"
                maxWidth="100%"
                sx={{ gap: 'var(--chakra-space-3)' }}>
                {facilitiesWithCoordinates.length > 0 && (
                  <Flex
                    wrap="wrap"
                    maxWidth="100%"
                    justify="center"
                    sx={{ gap: 'var(--chakra-space-3)' }}>
                    <Box maxWidth="100%">
                      <OlMap
                        facilities={facilitiesWithCoordinates}
                        zoomToInitialExtent={!urlSearchTerm}
                      />
                    </Box>
                    <FacilityMapLegend />
                  </Flex>
                )}
                {searchHasBeenMade && (
                  <Flex
                    justify="center"
                    direction="column"
                    maxWidth="100%"
                    marginTop={2}>
                    <FacilityPageSelector
                      pageItemLimit={pageItemLimit}
                      firstItemIdx={urlFirstItemIdx}
                      totalItemCount={data.length}
                      loading={false}
                    />
                    <FacilityList
                      facilities={data}
                      firstItemIdx={urlFirstItemIdx}
                      pageItemLimit={pageItemLimit}
                    />
                  </Flex>
                )}
              </Flex>
            </>
          )}
          {!isLoading && isSuccess && !gotFacilities && (
            <Box marginY={2.0} fontWeight="semibold">
              {t('facilities.noFacilitiesFoundFromSearch')}
            </Box>
          )}
        </Flex>
      </Flex>
    </>
  )
}
