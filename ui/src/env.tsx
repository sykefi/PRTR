const readRequiredEnvVar = (name: string): string => {
  if (!process.env[name]) {
    console.error(`Env variable ${name} must be set`)
  }
  return process.env[name] || ''
}

const getEnvVarOr = (name: string, fallBack: string) => {
  return process.env[name] || fallBack
}

const processEnv = process.env.NODE_ENV

export const isDevOrTestEnv =
  processEnv === 'development' || processEnv === 'test'

export const prtrServer = readRequiredEnvVar('REACT_APP_PRTR_SERVER')

export const facilityResultLimit = parseInt(
  getEnvVarOr('REACT_APP_FACILITIES_RESULT_LIMIT', '2000')
)

export const releasesResultLimit = parseInt(
  getEnvVarOr('REACT_APP_RELEASES_RESULT_LIMIT', '2000')
)
