import { FacilityMainActivityCode } from './FacilityMainActivityCode'
import { FacilityTopMainActivity } from './FacilityTopMainActivity'

export interface Facility {
  facilityId: string
  parentCompanyName: string
  nameOfFeature: string
  topMainActivity: FacilityTopMainActivity
  mainActivityCode: FacilityMainActivityCode
  x: number
  y: number
  streetName: string
  buildingNumber?: string
  postalCode: string
  city: string
  telephoneNo?: string
}
