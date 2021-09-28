import { BarePollutantRelease } from './BarePollutantRelease'

export interface PollutantRelease extends BarePollutantRelease {
  parentCompanyName: string
  nameOfFeature: string
  city: string | null
  x: number
  y: number
}

export const withId = (r: Omit<PollutantRelease, 'id'>): PollutantRelease => {
  return {
    ...r,
    id: `${r.facilityId}_${r.reportingYear}_${r.pollutantCode}_${r.medium}_${r.methodCode}`
  }
}
