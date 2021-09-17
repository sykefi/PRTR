export interface GeoJSONPointFeature {
  type: 'Feature'
  geometry: { type: 'Point'; coordinates: [number, number] }
  properties: {}
}

export interface GeoJSONFeatureCollection {
  type: 'FeatureCollection'
  crs: { type: 'name'; properties: { name: string } }
}

export interface GeoJSONPointFeatureCollection
  extends GeoJSONFeatureCollection {
  features: GeoJSONPointFeature[]
}
