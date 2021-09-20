import { useLocation } from 'react-router-dom'

export const useURLSearchParams = (): URLSearchParams => {
  return new URLSearchParams(useLocation().search)
}

export const useURLSearchParam = (name: string): string | undefined => {
  return useURLSearchParams().get(name) || undefined
}
