import { Facility } from '../api/models/Facility'
import { GeoJSONPointFeature } from './GeoJSON'

export interface FacilityData {
  facilities: Facility[]
  features: GeoJSONPointFeature[]
}
