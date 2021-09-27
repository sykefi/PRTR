import { PollutantRelease } from './PollutantRelease'

export interface PollutantReleaseWithFacilityInfo extends PollutantRelease {
  parentCompanyName: string
  nameOfFeature: string
  city: string | null
  x: number
  y: number
}
