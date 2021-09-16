import { useLocation } from 'react-router-dom'

export const useURLSearchParams = (): URLSearchParams => {
  return new URLSearchParams(useLocation().search)
}

export const useURLSearchParam = (name: string): string | null => {
  return useURLSearchParams().get(name)
}
