import i18next from 'i18next'
import { Namespace } from 'react-i18next'
import { Facility } from './api/models/Facility'
import { FacilityMainActivityCode } from './api/models/FacilityMainActivityCode'
import { PollutantCode } from './api/models/PollutantCode'
import { FacilityMapFeature } from './models/FacilityMapFeature'
import {
  GeoJSONPointFeature,
  GeoJSONPointFeatureCollection
} from './models/GeoJSON'

const facilityAsGeoJSONFeature = (
  f: Facility
): GeoJSONPointFeature<Omit<FacilityMapFeature, 'geometry'>> => {
  return {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [f.x, f.y] },
    properties: { facilityId: f.facilityId, nameOfFeature: f.nameOfFeature }
  }
}

export const facilitiesAsGeoJSONFC = (
  facilities: Facility[]
): GeoJSONPointFeatureCollection<Omit<FacilityMapFeature, 'geometry'>> => {
  return {
    type: 'FeatureCollection',
    crs: {
      type: 'name',
      properties: {
        name: 'urn:ogc:def:crs:EPSG::3067'
      }
    },
    features: facilities.map(facilityAsGeoJSONFeature)
  }
}

export const checkForMissingTranslations = (
  translationFile: Namespace,
  keys: string[],
  lng: 'fi' | 'sv' | 'en' = 'fi'
) => {
  const translations = i18next.getResourceBundle(lng, translationFile as string)
  const missing = keys.filter(k => !(k in translations))
  if (missing.length > 0) {
    console.error(
      `Missing translation keys (${lng}: ${translationFile}):`,
      missing
    )
  }
  const emptyValues = keys.filter(k => k in translations && !translations[k])
  if (emptyValues.length > 0) {
    console.warn(
      `Found empty values for translation keys (${lng}: ${translationFile}):`,
      emptyValues
    )
  }
}

export const getPollutantLabel = (
  t: (translationKey: string) => string | undefined,
  pollutant: PollutantCode
) => {
  const name = t(`pollutantName:${pollutant}`)
  const abbr = t(`pollutantAbbreviation:${pollutant}`)
  const brackets = abbr ? ` (${abbr})` : ''
  return `${name}${brackets}`
}

export const getLongPollutantLabel = (
  t: (translationKey: string) => string | undefined,
  pollutant: PollutantCode
) => {
  const name = t(`pollutantName:${pollutant}`)
  const abbr = t(`pollutantAbbreviation:${pollutant}`)
  const cas = t(`pollutantCasNumber:${pollutant}`)
  const brackets =
    !abbr && !cas
      ? ''
      : ` (${abbr}${abbr && cas && ', '}${cas && 'CAS: ' + cas})`
  return `${name}${brackets}`
}

export const handleCheckForMissingTranslations = () => {
  checkForMissingTranslations(
    'mainActivityCodeDesc',
    Object.values(FacilityMainActivityCode)
  )
  checkForMissingTranslations('pollutantName', Object.values(PollutantCode))
}
