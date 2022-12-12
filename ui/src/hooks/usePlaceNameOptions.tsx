import { useMemo } from 'react'
import { PRTRApiMetadata } from '../api/models/PRTRApiMetadata'
import { asSingleOption, OptionType } from '../models/OptionType'
import { useApiMetadata } from './useApiMetadata'

const getPlacenameOptions = (
  metadata: PRTRApiMetadata | undefined
): OptionType<string>[] => {
  return metadata
    ? metadata.present_cities
        .map(c => asSingleOption(c, c))
        .filter((o): o is OptionType<string> => Boolean(o))
    : []
}

export const usePlacenameOptions = () => {
  const { loading, isError, apiMetadata } = useApiMetadata()
  const placenameOptions = useMemo(
    () => getPlacenameOptions(apiMetadata),
    [apiMetadata]
  )
  return {
    placenameOptionsIsLoading: loading,
    placenameOptionsIsError: isError,
    placenameOptions
  }
}
