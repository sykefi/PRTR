import { FacilityMainActivityCode } from '../enums/FacilityMainActivityCode'
import { PollutantCodeAir, PollutantCodeWater } from '../enums/PollutantCode'

export interface PRTRApiMetadata {
  available_reporting_years: number[]
  present_pollutant_codes: [PollutantCodeAir[], PollutantCodeWater[]]
  present_cities: string[]
  present_main_activity_codes: FacilityMainActivityCode[]
}
