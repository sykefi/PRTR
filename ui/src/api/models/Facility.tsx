import { FacilityMainActivityCode } from '../../models/FacilityMainActivityCode'

export interface Facility {
  facilityId: string
  parentCompanyName: string
  nameOfFeature: string
  mainActivityCode: FacilityMainActivityCode
  mainActivityName: string
  x: number
  y: number
  streetName: string
  buildingNumber?: string
  postalCode: string
  city: string
  countryCode: string
  telephoneNo?: string
}
