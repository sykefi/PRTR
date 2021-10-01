export interface GeoJSONPointFeature<T = Record<string, unknown>> {
  type: 'Feature'
  geometry: { type: 'Point'; coordinates: [number, number] }
  properties: T
}

export interface GeoJSONFeatureCollection {
  type: 'FeatureCollection'
  crs: { type: 'name'; properties: { name: string } }
}

export interface GeoJSONPointFeatureCollection<T = Record<string, unknown>>
  extends GeoJSONFeatureCollection {
  features: GeoJSONPointFeature<T>[]
}
