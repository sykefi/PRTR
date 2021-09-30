import { Medium } from './api/models/Medium'
import { MethodCode } from './api/models/MethodCode'

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

export const translationKeyByMedium: Record<
  Medium,
  'releaseToAir' | 'releaseToWater'
> = {
  [Medium.AIR]: 'releaseToAir',
  [Medium.WATER]: 'releaseToWater'
}
