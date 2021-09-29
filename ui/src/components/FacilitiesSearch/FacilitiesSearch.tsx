import { Box, Button, Flex } from '@chakra-ui/react'
import { useQuery } from 'react-query'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
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
import { FacilitySearchURLParamName } from '../../models/FacilitySearchURLParamName'
import { ResultPageSelector } from './ResultPageSelector'
import { FacilitySearchPanel } from './FacilitySearchPanel'
import { FacilityList } from './FacilityList'

const pageItemLimit = 40

export const FacilitiesSearch = () => {
  const history = useHistory()
  const { t } = useTranslation()

  const urlSearchTerm = useURLSearchParam(FacilitySearchURLParamName.SearchTerm)
  const urlFacilityMainActivityCode = useURLSearchParam(
    FacilitySearchURLParamName.FacilityMainActivityCode
  ) as FacilityMainActivityCode | undefined

  const urlFirstItemIdx =
    useURLSearchParamInt(FacilitySearchURLParamName.FirstItemIdx) || 0

  const { isLoading, isError, isSuccess, data } = useQuery(
    ['facilities', urlSearchTerm || '', urlFacilityMainActivityCode || ''],
    async () => {
      return api.getFacilities({
        name_search_str: urlSearchTerm,
        main_activity_code: urlFacilityMainActivityCode
      })
    },
    {
      retry: false,
      staleTime: env.prtrDataCacheTime,
      cacheTime: env.prtrDataCacheTime
    }
  )
  const gotFacilities = !!data && data.length > 0

  return (
    <>
      <BelowNavigationHeaderPanel>
        <FacilitySearchPanel
          urlSearchTerm={urlSearchTerm}
          urlFacilityMainActivityCode={urlFacilityMainActivityCode}
        />
      </BelowNavigationHeaderPanel>

      <Flex direction="column" maxWidth="100%" align="center">
        {isError && (
          <Box margin={5.0} align="center" direction="column" fontWeight="bold">
            <Box>
              {t('facilities.loadFacilitiesErroredText', {
                searchTerm: urlSearchTerm,
                resultCount: data ? data.length : 0
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
                <ResultPageSelector
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
