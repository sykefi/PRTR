import { Medium } from '../enums/Medium'
import { PollutantCode } from '../enums/PollutantCode'

export interface ReleaseQueryParams {
  facility_id?: string
  skip?: number
  limit?: number
  reporting_year?: number
  medium?: Medium
  pollutant_code?: PollutantCode
  placename?: string
}
