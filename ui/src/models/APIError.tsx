export default class APIError extends Error {
  name: string
  message: string
  stack?: string | undefined
  constructor(error: Error) {
    super()
    this.name = 'APIError'
    this.message = error.message
    this.stack = error.stack
  }
}
