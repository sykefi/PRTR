import { Medium } from './Medium'
import { MethodCode } from './MethodCode'
import { PollutantCode } from './PollutantCode'

export interface PollutantRelease {
  facilityId: string
  reportingYear: number
  pollutantCode: PollutantCode
  pollutantName: string
  medium: Medium
  totalPollutantQuantityKg: number
  AccidentalPollutantQuantityKG: number
  methodCode: MethodCode
  methodName: string
}
