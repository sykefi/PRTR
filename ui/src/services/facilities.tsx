import APIError from '../models/APIError'
import { apiBasePath } from './conf'

const getData = async (url: string, controller: AbortController) => {
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
    const body = await res.json()
    return await body
  } catch (e) {
    throw new APIError(e as Error)
  }
}

export const getFacilities = async (
  controller: AbortController
): Promise<any> => {
  const url = `${apiBasePath}/facilities`
  return await getData(url, controller)
}
