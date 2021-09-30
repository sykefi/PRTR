import { releasesResultLimit } from '../env'
import { apiBasePath } from './conf'
import { serializeQueryParams, fetchData } from './utils'
import { ReleaseQueryParams } from './models/ReleaseQueryParams'
import { PollutantRelease, withId } from './models/PollutantRelease'
import { ReleasesResponse } from './models/ReleasesResponse'
import { PRTRListResponse } from './models/PRTRListResponse'

export const getReleases = async (
  queryParams: ReleaseQueryParams,
  signal?: AbortSignal
): Promise<PRTRListResponse<PollutantRelease>> => {
  const allQueryParams: ReleaseQueryParams = {
    limit: releasesResultLimit,
    ...queryParams
  }
  const queryString = serializeQueryParams(
    allQueryParams as Record<string, string | number>
  )
  const url = apiBasePath + '/releases?' + queryString
  const body = await fetchData<ReleasesResponse>(url, signal)

  return {
    ...body,
    data: body.data
      .map(withId)
      .sort((a, b) => b.reportingYear - a.reportingYear)
  }
}
