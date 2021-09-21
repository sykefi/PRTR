import APIError from '../models/APIError'
import { facilityResultLimit } from '../env'
import { apiBasePath } from './conf'
import { Facility } from './models/Facility'
import { FacilityQueryParams } from './models/FacilityQueryParams'
import { serializeQueryParams } from './utils'

const cache = new Map<string, Facility[]>()

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

  const cached = cache.get(url)
  if (cached) return cached

  const data = (await getData(url, controller)) as Facility[]

  // set facilities to cache if they were not filtered
  if (!Object.values(queryParams).some(v => !!v)) {
    cache.set(url, data)
  }

  return data
}
