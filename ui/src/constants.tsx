import { FacilityStatus } from './api/enums/FacilityStatus'
import { FacilityTopMainActivity } from './api/enums/FacilityTopMainActivity'
import { Medium } from './api/enums/Medium'
import { MethodCode } from './api/enums/MethodCode'
import { WasteClassificationCode } from './api/enums/WasteClassificationCode'
import { WasteTreatmentCode } from './api/enums/WasteTreatmentCode'

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

export const rgbColorsByTopMainActivity: Record<
  FacilityTopMainActivity,
  number[]
> = {
  [FacilityTopMainActivity.ENERGY]: [199, 199, 2],
  [FacilityTopMainActivity.METALS]: [86, 87, 76],
  [FacilityTopMainActivity.MINERALS]: [3, 211, 252],
  [FacilityTopMainActivity.CHEMICAL]: [245, 39, 43],
  [FacilityTopMainActivity.WASTE]: [0, 158, 63],
  [FacilityTopMainActivity.WOOD]: [10, 59, 240],
  [FacilityTopMainActivity.LIVESTOCK]: [153, 204, 0],
  [FacilityTopMainActivity.FOOD]: [252, 155, 63],
  [FacilityTopMainActivity.OTHER]: [247, 124, 208]
}

const getRgbColorByTopMainActivity = (
  t: Exclude<FacilityTopMainActivity, 'MISSING'>,
  opacity = 1
): string => {
  return `rgba(${[...rgbColorsByTopMainActivity[t], opacity].join(',')})`
}

export const fillColorByTopMainActivity: Record<
  FacilityTopMainActivity,
  string
> = {
  [FacilityTopMainActivity.ENERGY]: 'rgba(255, 255, 51, 0.6)',
  [FacilityTopMainActivity.METALS]: getRgbColorByTopMainActivity(
    FacilityTopMainActivity.METALS,
    0.4
  ),
  [FacilityTopMainActivity.MINERALS]: getRgbColorByTopMainActivity(
    FacilityTopMainActivity.MINERALS,
    0.4
  ),
  [FacilityTopMainActivity.CHEMICAL]: getRgbColorByTopMainActivity(
    FacilityTopMainActivity.CHEMICAL,
    0.4
  ),
  [FacilityTopMainActivity.WASTE]: getRgbColorByTopMainActivity(
    FacilityTopMainActivity.WASTE,
    0.4
  ),
  [FacilityTopMainActivity.WOOD]: getRgbColorByTopMainActivity(
    FacilityTopMainActivity.WOOD,
    0.4
  ),
  [FacilityTopMainActivity.LIVESTOCK]: getRgbColorByTopMainActivity(
    FacilityTopMainActivity.LIVESTOCK,
    0.5
  ),
  [FacilityTopMainActivity.FOOD]: getRgbColorByTopMainActivity(
    FacilityTopMainActivity.FOOD,
    0.4
  ),
  [FacilityTopMainActivity.OTHER]: getRgbColorByTopMainActivity(
    FacilityTopMainActivity.OTHER,
    0.4
  )
}

export const strokeColorByTopMainActivity: Record<
  FacilityTopMainActivity,
  string
> = {
  [FacilityTopMainActivity.ENERGY]: getRgbColorByTopMainActivity(
    FacilityTopMainActivity.ENERGY
  ),
  [FacilityTopMainActivity.METALS]: getRgbColorByTopMainActivity(
    FacilityTopMainActivity.METALS
  ),
  [FacilityTopMainActivity.MINERALS]: getRgbColorByTopMainActivity(
    FacilityTopMainActivity.MINERALS
  ),
  [FacilityTopMainActivity.CHEMICAL]: getRgbColorByTopMainActivity(
    FacilityTopMainActivity.CHEMICAL
  ),
  [FacilityTopMainActivity.WASTE]: getRgbColorByTopMainActivity(
    FacilityTopMainActivity.WASTE
  ),
  [FacilityTopMainActivity.WOOD]: getRgbColorByTopMainActivity(
    FacilityTopMainActivity.WOOD
  ),
  [FacilityTopMainActivity.LIVESTOCK]: getRgbColorByTopMainActivity(
    FacilityTopMainActivity.LIVESTOCK
  ),
  [FacilityTopMainActivity.FOOD]: getRgbColorByTopMainActivity(
    FacilityTopMainActivity.FOOD
  ),
  [FacilityTopMainActivity.OTHER]: getRgbColorByTopMainActivity(
    FacilityTopMainActivity.OTHER
  )
}
