import i18next from 'i18next'
import { Namespace } from 'react-i18next'
import { FacilityWithCoordinates } from './api/models/Facility'
import { FacilityMainActivityCode } from './api/enums/FacilityMainActivityCode'
import { PollutantCodeAir, PollutantCodeWater } from './api/enums/PollutantCode'
import { WasteTransfer } from './api/models/WasteTransfer'
import { FacilityMapFeature } from './models/FacilityMapFeature'
import {
  GeoJSONPointFeature,
  GeoJSONPointFeatureCollection
} from './models/GeoJSON'
import { TranslationKeys } from './react-i18next'

const facilityAsGeoJSONFeature = (
  f: FacilityWithCoordinates
): GeoJSONPointFeature<Omit<FacilityMapFeature, 'geometry'>> => {
  return {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [f.x, f.y] },
    properties: {
      facilityId: f.facilityId,
      nameOfFeature: f.nameOfFeature,
      topMainActivity: f.topMainActivity
    }
  }
}

export const facilitiesAsGeoJSONFC = (
  facilities: FacilityWithCoordinates[]
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
  t: (translationKey: TranslationKeys) => string | undefined,
  pollutant: PollutantCodeAir | PollutantCodeWater
) => {
  const name = t(`pollutantName:${pollutant}`)
  const abbr = t(`pollutantAbbreviation:${pollutant}`)
  const brackets = abbr ? ` (${abbr})` : ''
  return `${name}${brackets}`
}

export const getLongPollutantLabel = (
  t: (translationKey: TranslationKeys) => string | undefined,
  pollutant: PollutantCodeAir | PollutantCodeWater
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

export const getReceiverLabel = (wt: WasteTransfer): string => {
  const locationString = wt.receivingSiteCity
    ? wt.receivingSiteCity +
      (wt.receivingSiteCountryName ? `, ${wt.receivingSiteCountryName}` : '')
    : wt.receivingSiteCountryName || ''

  return wt.nameOfReceiver
    ? `${wt.nameOfReceiver}${locationString && ' (' + locationString + ')'}`
    : locationString
    ? locationString
    : '-'
}

export const handleCheckForMissingTranslations = () => {
  checkForMissingTranslations(
    'mainActivityCodeDesc',
    Object.values(FacilityMainActivityCode)
  )
  checkForMissingTranslations('pollutantName', Object.values(PollutantCodeAir))
  checkForMissingTranslations('pollutantName', Object.values(PollutantCodeWater))
}
