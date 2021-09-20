import { useTranslation } from 'react-i18next'
import { isDevOrTestEnv } from '../../env'
import { FacilityMainActivityCode } from '../../models/FacilityMainActivityCode'
import { OptionType } from '../../models/OptionType'
import { checkForMissingTranslations } from '../../utils'

export const useFacilityMainActivityOptions = (): OptionType[] => {
  const { t } = useTranslation('mainActivityCodeDesc')

  if (isDevOrTestEnv) {
    checkForMissingTranslations(
      'mainActivityCodeDesc',
      Object.values(FacilityMainActivityCode)
    )
  }

  return Object.values(FacilityMainActivityCode).reduce((prev, curr) => {
    return prev.concat({
      value: curr,
      label: t(curr)
    })
  }, [] as OptionType[])
}
