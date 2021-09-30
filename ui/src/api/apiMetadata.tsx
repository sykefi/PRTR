import { PRTRApiMetadata } from './models/PRTRApiMetadata'
import { apiBasePath } from './conf'
import { fetchData } from './utils'

export const getApiMetadata = async (): Promise<PRTRApiMetadata> => {
  return await fetchData<PRTRApiMetadata>(`${apiBasePath}/prtr-metadata`)
}
