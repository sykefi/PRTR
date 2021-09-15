export const serializeQueryParams = (obj: Record<string, string | number>) => {
  return Object.entries(obj)
    .reduce((prev: string[], curr) => {
      return prev.concat(
        encodeURIComponent(curr[0]) + '=' + encodeURIComponent(curr[1])
      )
    }, [])
    .join('&')
}
