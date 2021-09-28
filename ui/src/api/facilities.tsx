import APIError from '../models/APIError'
import { facilityResultLimit } from '../env'
import { apiBasePath } from './conf'
import { Facility } from './models/Facility'
import { FacilityQueryParams } from './models/FacilityQueryParams'
import { serializeQueryParams } from './utils'
import { FacilitiesResponse } from './models/FacilitiesResponse'

const cache = new Map<string, Facility[]>()

enum CacheKey {
  AllFacilities = 'allFacilities'
}

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
  controller: AbortController,
  queryParams: FacilityQueryParams = {}
): Promise<Facility[]> => {
  const allQueryParams: FacilityQueryParams = {
    limit: facilityResultLimit,
    ...queryParams
  }
  const queryString = serializeQueryParams(
    allQueryParams as Record<string, string | number>
  )
  const url = `${apiBasePath}/facilities?` + queryString

  if (!Object.values(queryParams).some(v => !!v)) {
    // get all facilities from cache if no filters are used
    const cached = cache.get(CacheKey.AllFacilities)
    if (cached) return cached
  }

  const body = await getData<FacilitiesResponse>(url, controller)
  if (Array.isArray(body)) return body

  // set facilities to cache if they were not filtered
  if (!Object.values(queryParams).some(v => !!v)) {
    cache.set(CacheKey.AllFacilities, body.data)
  }

  return body.data
}

export const getFacility = async (
  controller: AbortController,
  facilityId: string
): Promise<Facility> => {
  const allFacilities = cache.get(CacheKey.AllFacilities)
  if (allFacilities) {
    const match = allFacilities.find(f => f.facilityId === facilityId)
    if (match) return match
  }

  const queryParams: FacilityQueryParams = {
    facility_id: facilityId
  }
  const queryString = serializeQueryParams(
    queryParams as Record<string, string | number>
  )
  const url = `${apiBasePath}/facilities?` + queryString
  const body = await getData<FacilitiesResponse>(url, controller)

  if (Array.isArray(body) || body.data.length === 0) {
    throw new APIError({
      message: 'No facilities found with ID: ' + facilityId
    })
  }
  return body.data[0]
}
