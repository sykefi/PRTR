import { pickBy } from 'lodash'
import APIError from '../models/APIError'

export const serializeQueryParams = (obj: Record<string, string | number>) => {
  const paramArray = Object.entries(pickBy(obj, v => v !== undefined))
  const strArray = []
  for (const p of paramArray){
    if (Array.isArray(p[1])){ //if parameter has multiple different values
      for (const v of p[1]){
        strArray.push(encodeURIComponent(p[0]) + "=" + encodeURIComponent(v))
      }
    } else { //parameter has one value
      strArray.push(encodeURIComponent(p[0]) + '=' + encodeURIComponent(p[1]))
    }
  }
  const paramstr = strArray.join('&')
  return paramstr
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
