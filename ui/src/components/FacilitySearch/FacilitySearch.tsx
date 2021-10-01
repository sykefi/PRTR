import { Box, Flex } from '@chakra-ui/react'
import { useQuery } from 'react-query'
import { useTranslation } from 'react-i18next'
import * as api from '../../api'
import * as env from '../../env'
import { BelowNavigationHeaderPanel } from '../Common'
import { LoadAnimation } from '../LoadAnimation/LoadAnimation'
import { OlMap } from '../OlMap'
import {
  useURLSearchParam,
  useURLSearchParamInt
} from '../../hooks/useURLSearchParams'
import { FacilityMainActivityCode } from '../../api/models/FacilityMainActivityCode'
import { URLSearchParamName } from '../../models/URLSearchParamName'
import { FacilityPageSelector } from './FacilityPageSelector'
import { FacilityFilterPanel } from './FacilityFilterPanel'
import { FacilityList } from './FacilityList'

const pageItemLimit = 40

export const FacilitySearch = () => {
  const { t } = useTranslation()

  const urlSearchTerm = useURLSearchParam(URLSearchParamName.SearchTerm)
  const urlMunicipality = useURLSearchParam(URLSearchParamName.Municipality)
  const urlFacilityMainActivityCode = useURLSearchParam(
    URLSearchParamName.FacilityMainActivityCode
  ) as FacilityMainActivityCode | undefined

  const urlFirstItemIdx =
    useURLSearchParamInt(URLSearchParamName.FirstItemIdx) || 0

  const { isLoading, isError, isSuccess, data } = useQuery(
    ['facilities', urlSearchTerm, urlFacilityMainActivityCode],
    async () => {
      return api.getFacilities({
        name_search_str: urlSearchTerm,
        main_activity_code: urlFacilityMainActivityCode
      })
    },
    {
      retry: false,
      ...env.rqCacheSettings
    }
  )
  const gotFacilities = !!data && data.length > 0

  return (
    <>
      <BelowNavigationHeaderPanel>
        <FacilityFilterPanel
          urlSearchTerm={urlSearchTerm}
          urlMunicipality={urlMunicipality}
          urlFacilityMainActivityCode={urlFacilityMainActivityCode}
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
          flexWrap="wrap"
          justify="center"
          align="center">
          {gotFacilities && (
            <>
              <Flex justify={{ base: 'center', lg: 'flex-start' }} width="100%">
                <FacilityPageSelector
                  pageItemLimit={pageItemLimit}
                  firstItemIdx={urlFirstItemIdx}
                  totalItemCount={data.length}
                  loading={false}
                />
              </Flex>
              <Flex wrap="wrap" justify="center" maxWidth="100%">
                <FacilityList
                  facilities={data}
                  firstItemIdx={urlFirstItemIdx}
                  pageItemLimit={pageItemLimit}
                />
                <Box px={{ base: 'unset', md: 2 }} m={1} maxWidth="100%">
                  <OlMap
                    facilities={data}
                    zoomToInitialExtent={!urlSearchTerm}
                  />
                </Box>
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
