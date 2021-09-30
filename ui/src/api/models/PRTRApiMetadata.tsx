import { FacilityMainActivityCode } from './FacilityMainActivityCode'
import { PollutantCode } from './PollutantCode'

export interface PRTRApiMetadata {
  available_reporting_years: number[]
  present_pollutant_codes: PollutantCode[]
  present_cities: string[]
  present_main_activity_codes: FacilityMainActivityCode[]
}
