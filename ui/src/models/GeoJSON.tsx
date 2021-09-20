export interface GeoJSONPointFeature {
  type: 'Feature'
  geometry: { type: 'Point'; coordinates: [number, number] }
  properties: Record<string, unknown>
}

export interface GeoJSONFeatureCollection {
  type: 'FeatureCollection'
  crs: { type: 'name'; properties: { name: string } }
}

export interface GeoJSONPointFeatureCollection
  extends GeoJSONFeatureCollection {
  features: GeoJSONPointFeature[]
}
