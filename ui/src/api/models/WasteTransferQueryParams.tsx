import { AllOrInternationalFilter } from '../enums/AllOrInternationalFilter'

export interface WasteTransferQueryParams {
  facility_id?: string
  skip?: number
  limit?: number
  reporting_year?: number
  all_or_international_filter?: AllOrInternationalFilter
  placename?: string
}
