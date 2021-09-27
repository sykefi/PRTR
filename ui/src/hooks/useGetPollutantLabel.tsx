import { useTranslation } from 'react-i18next'
import { PollutantCode } from '../api/models/PollutantCode'

export const useGetPollutantLabel = () => {
  const { t } = useTranslation(['pollutantName', 'pollutantAbbreviation'])
  return (pollutant: PollutantCode) => {
    const name = t(`pollutantName:${pollutant}`)
    const abbr = t(`pollutantAbbreviation:${pollutant}`)
    return `${abbr}${abbr && name && ' - '} ${name}`
  }
}
