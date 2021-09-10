export const readRequiredEnvVar = (name: string): string => {
  if (!process.env[name]) {
    console.error(`Env variable ${name} must be set`)
  }
  return process.env[name] || ''
}

export const prtrServer = readRequiredEnvVar('REACT_APP_PRTR_SERVER')
