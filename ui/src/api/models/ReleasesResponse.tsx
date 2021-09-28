import { PollutantRelease } from './PollutantRelease'
import { PRTRListResponse } from './PRTRListResponse'

export type ReleasesResponse = PRTRListResponse<Omit<PollutantRelease, 'id'>>
