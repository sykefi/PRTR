import { useLocation } from 'react-router-dom'

export const useURLSearchParams = (): URLSearchParams => {
  return new URLSearchParams(useLocation().search)
}

export const useURLSearchParam = <T extends string>(
  name: string
): T | undefined => {
  return (useURLSearchParams().get(name) || undefined) as T | undefined
}

export const useURLSearchParamInt = (name: string): number | undefined => {
  const num = useURLSearchParam(name)
  return num !== undefined ? parseInt(num) : undefined
}

export const useURLSearchParamIntArray = (name: string): number[] | undefined => {
  const nums = useURLSearchParamArray(name)
  return nums !== undefined ? nums.map(elem => parseInt(elem,10)) : undefined
}

export const useURLSearchParamArray = <T extends string>(name: string): T[] | undefined => {
  const urlParams = useURLSearchParams().getAll(name)
  if (urlParams.length == 0){
    return undefined as T[] | undefined
  } else {
    return urlParams as T[] | undefined
  }
}


