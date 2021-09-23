import { Medium } from './Medium'
import { MethodCode } from './MethodCode'
import { PollutantCode } from './PollutantCode'

export interface PollutantRelease {
  id: string
  facilityId: string
  reportingYear: number
  pollutantCode: PollutantCode
  medium: Medium
  totalPollutantQuantityKg: number
  AccidentalPollutantQuantityKG: number
  methodCode: MethodCode
}

export const withId = (r: Omit<PollutantRelease, 'id'>): PollutantRelease => {
  return {
    ...r,
    id: `${r.facilityId}_${r.reportingYear}_${r.pollutantCode}_${r.medium}_${r.methodCode}`
  }
}
