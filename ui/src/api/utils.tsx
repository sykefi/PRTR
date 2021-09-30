import { pickBy } from 'lodash'
import APIError from '../models/APIError'

export const serializeQueryParams = (obj: Record<string, string | number>) => {
  return Object.entries(pickBy(obj, v => v !== undefined))
    .reduce((prev: string[], curr) => {
      return prev.concat(
        encodeURIComponent(curr[0]) + '=' + encodeURIComponent(curr[1])
      )
    }, [])
    .join('&')
}

export const fetchData = async <T,>(
  url: string,
  signal?: AbortSignal
): Promise<T> => {
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
