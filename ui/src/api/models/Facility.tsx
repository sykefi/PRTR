import { FacilityMainActivityCode } from './FacilityMainActivityCode'
import { FacilityTopMainActivity } from './FacilityTopMainActivity'
import { FacilityStatus } from './FacilityStatus'

export interface Facility {
  facilityId: string
  parentCompanyName: string
  nameOfFeature: string
  topMainActivity: FacilityTopMainActivity
  mainActivityCode: FacilityMainActivityCode
  x: number | null
  y: number | null
  streetName: string | null
  buildingNumber: string | null
  postalCode: string | null
  city: string | null
  telephoneNo: string | null
  status: FacilityStatus | null
}

export interface FacilityWithCoordinates extends Facility {
  x: number
  y: number
}

export const hasCoordinates = (f: Facility): f is FacilityWithCoordinates => {
  return !!f.x && !!f.y
}
