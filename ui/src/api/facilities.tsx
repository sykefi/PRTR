import APIError from '../models/APIError'
import { apiBasePath } from './conf'
import { Facility } from './models/Facility'
import { FacilityQueryParams } from './models/FacilityQueryParams'
import { serializeQueryParams } from './utils'

const getData = async <T extends any>(
  url: string,
  controller: AbortController
): Promise<T> => {
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
        return [] as T
      }
      throw new Error(`Fetch failed: ${url} ->
        status=${res.status}
        statusText=${res.statusText}
        url=${res.url}
        body=${JSON.stringify(errorBody)}`)
    }
    const body = (await res.json()) as T
    return await body
  } catch (e) {
    throw new APIError(e as Error)
  }
}

export const getFacilities = async (
  controller: AbortController,
  queryParams?: FacilityQueryParams
): Promise<Facility[]> => {
  const queryString =
    queryParams &&
    '?' + serializeQueryParams(queryParams as Record<string, string | number>)
  const url = `${apiBasePath}/facilities` + (queryString || '')
  return await getData<Facility[]>(url, controller)
}
