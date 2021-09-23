import APIError from '../models/APIError'
import { releasesResultLimit } from '../env'
import { apiBasePath } from './conf'
import { serializeQueryParams } from './utils'
import { ReleaseQueryParams } from './models/ReleaseQueryParams'
import { PollutantRelease, withId } from './models/PollutantRelease'

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

export const getReleases = async (
  controller: AbortController,
  queryParams: ReleaseQueryParams = {}
): Promise<PollutantRelease[]> => {
  const allQueryParams: ReleaseQueryParams = {
    limit: releasesResultLimit,
    ...queryParams
  }
  const queryString = serializeQueryParams(
    allQueryParams as Record<string, string | number>
  )
  const url = `${apiBasePath}/releases?` + queryString
  const data = (await getData(url, controller)) as Omit<
    PollutantRelease,
    'id'
  >[]
  return data.map(withId)
}
