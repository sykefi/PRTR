import APIError from '../models/APIError'
import { releasesResultLimit } from '../env'
import { apiBasePath } from './conf'
import { serializeQueryParams } from './utils'
import { ReleaseQueryParams } from './models/ReleaseQueryParams'
import { PollutantRelease, withId } from './models/PollutantRelease'
import { ReleasesResponse } from './models/ReleasesResponse'
import { PRTRListResponse } from './models/PRTRListResponse'

const getData = async <T,>(url: string, signal?: AbortSignal): Promise<T> => {
  try {
    const res = await fetch(url, { signal })
    if (!res.ok) {
      let errorBody
      try {
        errorBody = await res.json()
      } catch {
        errorBody = undefined
      }
      throw new Error(`Fetch failed: ${url} ->
        url=${res.url}
        status=${res.status}
        statusText=${res.statusText}
        body=${JSON.stringify(errorBody)}`)
    }
    const body = await res.json()
    return (await body) as T
  } catch (e) {
    throw new APIError(e as Error)
  }
}

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
  const body = await getData<ReleasesResponse>(url, signal)

  return {
    ...body,
    data: body.data
      .map(withId)
      .sort((a, b) => b.reportingYear - a.reportingYear)
  }
}
