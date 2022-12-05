import { Medium } from '../enums/Medium'
import { PollutantCodeAir, PollutantCodeWater } from '../enums/PollutantCode'

export interface ReleaseQueryParams {
  facility_id?: string
  skip?: number
  limit?: number
  reporting_year?: number
  medium?: Medium
  pollutant_code?: PollutantCodeAir | PollutantCodeWater
  placename?: string
  sort_key?: string
  descending?: boolean
}
