import { useTranslation } from 'react-i18next'
import { FacilityMainActivityCode } from '../../models/FacilityMainActivityCode'
import { OptionType } from '../../models/OptionType'

export const useFacilityMainActivityOptions =
  (): OptionType<FacilityMainActivityCode>[] => {
    const { t } = useTranslation('mainActivityCodeDesc')

    return Object.values(FacilityMainActivityCode).reduce((prev, curr) => {
      return prev.concat({
        value: curr,
        label: t(curr)
      })
    }, [] as OptionType<FacilityMainActivityCode>[])
  }
