import { Medium } from '../enums/Medium'
import { MethodCode } from '../enums/MethodCode'
import { PollutantCode } from '../enums/PollutantCode'

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
