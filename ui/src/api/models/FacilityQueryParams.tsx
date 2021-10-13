import { FacilityMainActivityCode } from '../enums/FacilityMainActivityCode'
import { FacilityTopMainActivity } from '../enums/FacilityTopMainActivity'

export interface FacilityQueryParams {
  facility_id?: string
  skip?: number
  limit?: number
  name_search_str?: string
  placename?: string
  main_activity?: FacilityMainActivityCode | FacilityTopMainActivity
}
