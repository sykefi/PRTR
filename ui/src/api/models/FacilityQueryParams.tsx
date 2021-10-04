import { FacilityMainActivityCode } from './FacilityMainActivityCode'

export interface FacilityQueryParams {
  facility_id?: string
  skip?: number
  limit?: number
  name_search_str?: string
  placename?: string
  main_activity_code?: FacilityMainActivityCode
}
