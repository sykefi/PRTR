import { Medium } from '../enums/Medium'
import { MethodCode } from '../enums/MethodCode'
import { PollutantCodeAir, PollutantCodeWater } from '../enums/PollutantCode'

export interface BarePollutantRelease {
  id: string
  facilityId: string
  reportingYear: number
  pollutantCode: PollutantCodeAir | PollutantCodeWater
  medium: Medium
  totalPollutantQuantityKg: number
  AccidentalPollutantQuantityKG: number
  methodCode: MethodCode
}
