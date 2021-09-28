export type PRTRListResponse<T> = {
  data: T[]
  count: number
  skipped: number
  limit: number
}
