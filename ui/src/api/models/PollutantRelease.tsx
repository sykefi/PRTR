import { BarePollutantRelease } from './BarePollutantRelease'

export interface PollutantRelease extends BarePollutantRelease {
  nameOfFeature: string
  city: string | null
}

export const withId = (r: Omit<PollutantRelease, 'id'>): PollutantRelease => {
  return {
    ...r,
    id: `${r.facilityId}_${r.reportingYear}_${r.pollutantCode}_${r.medium}_${r.methodCode}`
  }
}
