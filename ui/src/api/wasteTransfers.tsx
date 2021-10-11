import { releasesResultLimit } from '../env'
import { apiBasePath } from './conf'
import { serializeQueryParams, fetchData } from './utils'
import { WasteTransferQueryParams } from './models/WasteTransferQueryParams'
import { WasteTransferResponse } from './models/WasteTransferResponse'
import { PRTRListResponse } from './models/PRTRListResponse'
import { WasteTransfer, withId } from './models/WasteTransfer'

export const getWasteTransfers = async (
  queryParams: WasteTransferQueryParams,
  signal?: AbortSignal
): Promise<PRTRListResponse<WasteTransfer>> => {
  const allQueryParams: WasteTransferQueryParams = {
    limit: releasesResultLimit,
    ...queryParams
  }
  const queryString = serializeQueryParams(
    allQueryParams as Record<string, string | number>
  )
  const url = apiBasePath + '/waste-transfers?' + queryString
  const body = await fetchData<WasteTransferResponse>(url, signal)

  return {
    ...body,
    data: body.data.map(withId)
  }
}
