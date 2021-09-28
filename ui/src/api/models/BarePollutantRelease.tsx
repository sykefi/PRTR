import { Medium } from './Medium'
import { MethodCode } from './MethodCode'
import { PollutantCode } from './PollutantCode'

export interface BarePollutantRelease {
  id: string
  facilityId: string
  reportingYear: number
  pollutantCode: PollutantCode
  medium: Medium
  totalPollutantQuantityKg: number
  AccidentalPollutantQuantityKG: number
  methodCode: MethodCode
}
