import { FacilityMainActivityCode } from './FacilityMainActivityCode'
import { FacilityTopMainActivity } from './FacilityTopMainActivity'
import { MethodCode } from './MethodCode'
import { WasteClassificationCode } from './WasteClassificationCode'
import { WasteTreatmentCode } from './WasteTreatmentCode'

export interface WasteTransfer {
  id: string
  facilityId: string
  reportingYear: number
  nameOfFeature: string
  topMainActivity: FacilityTopMainActivity
  mainActivityCode: FacilityMainActivityCode
  city: string
  wasteClassificationCode: WasteClassificationCode
  wasteTreatmentCode: WasteTreatmentCode
  totalWasteQuantityTNE: number
  methodCode: MethodCode
  nameOfReceiver: string | null
  receivingSiteCity: string | null
  receivingSiteCountryName: string | null
}

export const withId = (wt: Omit<WasteTransfer, 'id'>): WasteTransfer => {
  return {
    ...wt,
    id: `${wt.facilityId}_${wt.reportingYear}_${wt.wasteClassificationCode}_${wt.wasteTreatmentCode}_${wt.totalWasteQuantityTNE}`
  }
}
