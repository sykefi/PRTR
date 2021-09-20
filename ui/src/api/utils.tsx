import { pickBy } from 'lodash'

export const serializeQueryParams = (obj: Record<string, string | number>) => {
  return Object.entries(pickBy(obj, v => v !== undefined))
    .reduce((prev: string[], curr) => {
      return prev.concat(
        encodeURIComponent(curr[0]) + '=' + encodeURIComponent(curr[1])
      )
    }, [])
    .join('&')
}
