export interface FacilityQueryParams {
  facility_id?: string
  skip?: number
  limit?: number
  name_search_str?: string
  main_activity_code?: string //TODO replace with enum
}
