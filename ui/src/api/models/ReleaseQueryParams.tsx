import { PollutantCode } from './PollutantCode'

export interface ReleaseQueryParams {
  facility_id?: string
  skip?: number
  limit?: number
  reporting_year?: number
  pollutant_code?: PollutantCode
}
