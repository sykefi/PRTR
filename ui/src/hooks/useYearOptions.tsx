import { useMemo } from 'react'
import { PRTRApiMetadata } from '../api/models/PRTRApiMetadata'
import { asOption, OptionType } from '../models/OptionType'
import { useApiMetadata } from './useApiMetadata'

const getYearOptions = (
  metadata: PRTRApiMetadata | undefined
): OptionType<number>[] => {
  return metadata
    ? metadata.available_reporting_years
        .map(y => asOption(y, y))
        .filter((o): o is OptionType<number> => Boolean(o))
    : []
}

export const useYearOptions = () => {
  const { loading, isError, apiMetadata } = useApiMetadata()
  const yearOptions = useMemo(() => getYearOptions(apiMetadata), [apiMetadata])
  return {
    yearOptionsIsLoading: loading,
    yearOptionsIsError: isError,
    yearOptions
  }
}
