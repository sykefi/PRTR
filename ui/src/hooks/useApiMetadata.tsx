import { useQuery } from 'react-query'
import * as api from '../api'
import * as env from '../env'

export const useApiMetadata = () => {
  const { isLoading, isFetching, isError, data } = useQuery(
    ['prtrApiMetadata'],
    api.getApiMetadata,
    env.rqCacheSettings
  )

  return {
    loading: isLoading || isFetching,
    apiMetadata: data,
    isError: isError
  }
}
