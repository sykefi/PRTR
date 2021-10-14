import authoritiesJson from './assets/authorityInfo/authorityInfo.json'
import { AuthorityInfo } from './assets/authorityInfo/models/AuthorityInfo'
import { RawAuthorityInfo } from './assets/authorityInfo/models/RawAuthorityInfo'

const authorities = authoritiesJson as RawAuthorityInfo[]

type idName = string

const authorityDict: Record<idName, AuthorityInfo> = authorities.reduce(
  (prev, curr) => {
    prev[curr.NimiEng as idName] = {
      idName: curr.NimiEng,
      phoneNum: curr.Puh,
      url: curr.Url,
      name: { fi: curr.Nimi, sv: curr.NimiRuo, en: curr.NimiEng }
    }
    return prev
  },
  {} as Record<idName, AuthorityInfo>
)

export const getAuthorityInfo = (name: idName): AuthorityInfo | undefined => {
  if (name in authorityDict) {
    return authorityDict[name]
  }
}
