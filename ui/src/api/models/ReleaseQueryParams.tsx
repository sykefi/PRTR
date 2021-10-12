import { Medium } from './Medium'
import { PollutantCode } from './PollutantCode'

export interface ReleaseQueryParams {
  facility_id?: string
  skip?: number
  limit?: number
  reporting_year?: number
  medium?: Medium
  pollutant_code?: PollutantCode
  placename?: string
}
