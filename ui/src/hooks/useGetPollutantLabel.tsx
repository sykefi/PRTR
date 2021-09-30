import { useTranslation } from 'react-i18next'
import { PollutantCode } from '../api/models/PollutantCode'

export const useGetPollutantLabel = () => {
  const { t } = useTranslation([
    'pollutantName',
    'pollutantAbbreviation',
    'pollutantCasNumber'
  ])
  return (pollutant: PollutantCode) => {
    const name = t(`pollutantName:${pollutant}`)
    const abbr = t(`pollutantAbbreviation:${pollutant}`)
    const cas = t(`pollutantCasNumber:${pollutant}`)
    const brackets =
      !abbr && !cas
        ? ''
        : ` (${abbr}${abbr && cas && ', '}${cas && 'CAS: ' + cas})`
    return `${name}${brackets}`
  }
}
