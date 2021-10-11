import { FacilityStatus } from './api/models/FacilityStatus'
import { Medium } from './api/models/Medium'
import { MethodCode } from './api/models/MethodCode'
import { WasteClassificationCode } from './api/models/WasteClassificationCode'
import { WasteTreatmentCode } from './api/models/WasteTreatmentCode'

export const colorSchemeByMethodCode: Record<MethodCode, string> = {
  [MethodCode.M]: 'green',
  [MethodCode.C]: 'blue',
  [MethodCode.E]: 'orange'
}

export const translationKeyByMethodCode: Record<
  MethodCode,
  'measured' | 'calculated' | 'estimated'
> = {
  [MethodCode.M]: 'measured',
  [MethodCode.C]: 'calculated',
  [MethodCode.E]: 'estimated'
}

export const colorSchemeByMedium: Record<Medium, string> = {
  [Medium.AIR]: 'orange',
  [Medium.WATER]: 'cyan'
}

export const colorSchemeByWasteClassification: Record<
  WasteClassificationCode,
  string
> = {
  [WasteClassificationCode.HW]: 'purple',
  [WasteClassificationCode.NONHW]: 'orange'
}

export const colorSchemeByWasteTreatment: Record<WasteTreatmentCode, string> = {
  [WasteTreatmentCode.D]: 'blue',
  [WasteTreatmentCode.R]: 'green'
}

export const translationKeyByMedium: Record<
  Medium,
  'releaseToAir' | 'releaseToWater'
> = {
  [Medium.AIR]: 'releaseToAir',
  [Medium.WATER]: 'releaseToWater'
}

export const colorSchemeByFacilityStatus: Record<FacilityStatus, string> = {
  [FacilityStatus.DECOMMISSIONED]: 'purple',
  [FacilityStatus.DISUSED]: 'red',
  [FacilityStatus.FUNCTIONAL]: 'green',
  [FacilityStatus.NOT_REGULATED]: 'gray'
}