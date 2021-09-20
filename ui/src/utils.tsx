import i18next from 'i18next'
import { Namespace } from 'react-i18next'
import { Facility } from './api/models/Facility'
import {
  GeoJSONPointFeature,
  GeoJSONPointFeatureCollection
} from './models/GeoJSON'

export const facilityAsGeoJSONFeature = (f: Facility): GeoJSONPointFeature => {
  return {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [f.x, f.y] },
    properties: {}
  }
}

export const facilitiesAsGeoJSONFC = (
  facilities: Facility[]
): GeoJSONPointFeatureCollection => {
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
}
