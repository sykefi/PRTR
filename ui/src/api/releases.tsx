import APIError from '../models/APIError'
import { releasesResultLimit } from '../env'
import { apiBasePath } from './conf'
import { serializeQueryParams } from './utils'
import { ReleaseQueryParams } from './models/ReleaseQueryParams'
import { PollutantRelease, withId } from './models/PollutantRelease'
import { PollutantReleaseWithFacilityInfo } from './models/PollutantReleaseWithFacilityInfo'

const getData = async <T,>(
  url: string,
  controller: AbortController
): Promise<T | []> => {
  try {
    const res = await fetch(url, { signal: controller.signal })
    if (!res.ok) {
      let errorBody
      try {
        errorBody = await res.json()
      } catch {
        errorBody = undefined
      }
      if (res.status === 404) {
        console.warn('No releases found, response:', res)
        return []
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

export const handleGetReleases = async <T extends PollutantRelease>(
  controller: AbortController,
  queryParams: ReleaseQueryParams,
  withFacilityInfo: boolean
): Promise<T[]> => {
  const allQueryParams: ReleaseQueryParams = {
    limit: releasesResultLimit,
    ...queryParams
  }
  const queryString = serializeQueryParams(
    allQueryParams as Record<string, string | number>
  )
  const url =
    apiBasePath +
    (withFacilityInfo ? '/releases-facilities?' : '/releases?') +
    queryString

  const data = (await getData(url, controller)) as Omit<T, 'id'>[]
  return data
    .map(withId)
    .sort((a, b) => b.reportingYear - a.reportingYear) as T[]
}

export const getReleases = async (
  controller: AbortController,
  queryParams: ReleaseQueryParams = {}
): Promise<PollutantRelease[]> => {
  return await handleGetReleases(controller, queryParams, false)
}

export const getReleasesWithFacilityInfo = async (
  controller: AbortController,
  queryParams: ReleaseQueryParams = {}
): Promise<PollutantReleaseWithFacilityInfo[]> => {
  return (await handleGetReleases<PollutantReleaseWithFacilityInfo>(
    controller,
    queryParams,
    true
  )) as PollutantReleaseWithFacilityInfo[]
}
