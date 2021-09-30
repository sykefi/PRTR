import APIError from '../models/APIError'
import { facilityResultLimit } from '../env'
import { apiBasePath } from './conf'
import { Facility } from './models/Facility'
import { FacilityQueryParams } from './models/FacilityQueryParams'
import { serializeQueryParams } from './utils'
import { FacilitiesResponse } from './models/FacilitiesResponse'

const getData = async <T,>(
  url: string,
  signal?: AbortSignal
): Promise<T | []> => {
  try {
    const res = await fetch(url, { signal })
    if (!res.ok) {
      let errorBody
      try {
        errorBody = await res.json()
      } catch {
        errorBody = undefined
      }
      if (res.status === 404) {
        console.warn('No facilities found, response:', res)
        return []
      }
      throw new Error(`Fetch failed: ${url} ->
        status=${res.status}
        statusText=${res.statusText}
        url=${res.url}
        body=${JSON.stringify(errorBody)}`)
    }
    const body = await res.json()
    return (await body) as T
  } catch (e) {
    throw new APIError(e as Error)
  }
}

export const getFacilities = async (
  queryParams: FacilityQueryParams = {},
  abortSignal?: AbortSignal
): Promise<Facility[]> => {
  const allQueryParams: FacilityQueryParams = {
    limit: facilityResultLimit,
    ...queryParams
  }
  const queryString = serializeQueryParams(
    allQueryParams as Record<string, string | number>
  )
  const url = `${apiBasePath}/facilities?` + queryString
  const body = await getData<FacilitiesResponse>(url, abortSignal)
  if (Array.isArray(body)) return body
  return body.data
}

export const getFacility = async (
  facilityId: string,
  abortSignal?: AbortSignal
): Promise<Facility> => {
  const data = await getFacilities({ facility_id: facilityId }, abortSignal)
  if (data.length === 0) {
    throw new APIError({
      message: 'No facilities found with ID: ' + facilityId
    })
  }
  return data[0]
}
