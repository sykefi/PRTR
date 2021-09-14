import APIError from '../models/APIError'
import { apiBasePath } from './conf'
import { Facility } from './models/Faclity'

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
  controller: AbortController
): Promise<Facility[]> => {
  const url = `${apiBasePath}/facilities`
  return await getData<Facility[]>(url, controller)
}
