import { useLocation } from 'react-router-dom'

export const useURLSearchParams = (): URLSearchParams => {
  return new URLSearchParams(useLocation().search)
}

export const useURLSearchParam = <T extends string>(
  name: string
): T | undefined => {
  return (useURLSearchParams().get(name) || undefined) as T | undefined
}
