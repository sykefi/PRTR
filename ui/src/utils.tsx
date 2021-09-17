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
