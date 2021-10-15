import { Box, Flex } from '@chakra-ui/layout'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import * as api from '../../api'
import { AllOrInternationalFilter } from '../../api/enums/AllOrInternationalFilter'
import * as env from '../../env'
import {
  useURLSearchParam,
  useURLSearchParamInt
} from '../../hooks/useURLSearchParams'
import { URLSearchParamName } from '../../models/URLSearchParamName'
import { BelowNavigationHeaderPanel } from '../Common/BelowNavigationHeaderPanel'
import { SearchInfo } from '../Common/SearchInfo'
import { WasteTransferFilterPanel } from './WasteTransferFilterPanel'
import { WasteTransferPageSelector } from './WasteTransferPageSelector'
import { WasteTransferTable } from './WasteTransferTable'

const pageItemLimit = 25

export const WasteTransferSearch = () => {
  const { t } = useTranslation()

  const urlFirstItemIdx = useURLSearchParamInt(URLSearchParamName.FirstItemIdx)
  const urlYear = useURLSearchParamInt(URLSearchParamName.Year)
  const urlPlacename = useURLSearchParam(URLSearchParamName.Placename)
  const urlAllOrInternational =
    useURLSearchParam<AllOrInternationalFilter>(
      URLSearchParamName.AllOrInternational
    ) || AllOrInternationalFilter.ALL

  const { isLoading, isFetching, isError, isSuccess, data } = useQuery(
    ['wasteTransfers', urlFirstItemIdx, urlYear, urlPlacename, urlAllOrInternational],
    async () => {
      if (urlFirstItemIdx === undefined) return undefined
      return await api.getWasteTransfers({
        reporting_year: urlYear,
        skip: urlFirstItemIdx,
        limit: pageItemLimit,
        placename: urlPlacename,
        all_or_international_filter: urlAllOrInternational
      })
    },
    { keepPreviousData: true, retry: 2, ...env.rqCacheSettings }
  )
  const loading = isLoading || isFetching
  const hasWasteTransfers = !!data && data.data.length > 0

  return (
    <>
      <BelowNavigationHeaderPanel>
        <SearchInfo text={t('descriptions.wasteTransfers')} />
        <WasteTransferFilterPanel
          urlYear={urlYear}
          urlAllOrInternational={urlAllOrInternational}
          urlPlacename={urlPlacename}
        />
      </BelowNavigationHeaderPanel>
      <Flex
        wrap="wrap"
        align="center"
        direction="column"
        maxWidth="100%"
        sx={{ gap: 'var(--chakra-space-3)' }}
        padding={3}
        data-cy="waste-transfers-container">
        {urlFirstItemIdx !== undefined && (
          <>
            {hasWasteTransfers && (
              <WasteTransferPageSelector
                pageItemLimit={pageItemLimit}
                firstItemIdx={urlFirstItemIdx}
                totalItemCount={data.count}
                loading={loading}
              />
            )}
            {!loading && isSuccess && !hasWasteTransfers && (
              <Box marginY={2.0} fontWeight="semibold">
                {t('wasteTransfers.noWasteTransfersFoundFromSearch')}
              </Box>
            )}
            {!loading && isError && (
              <Box marginY={2.0} fontWeight="semibold">
                {t('wasteTransfers.wasteTransfersFetchErrorInfo')}
              </Box>
            )}
            {(loading || (isSuccess && hasWasteTransfers)) && (
              <WasteTransferTable
                loading={loading}
                wasteTransfers={data?.data || []}
              />
            )}
          </>
        )}
      </Flex>
    </>
  )
}
