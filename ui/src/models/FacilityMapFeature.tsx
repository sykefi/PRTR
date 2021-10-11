import Point from 'ol/geom/Point'
import { Facility } from '../api/models/Facility'

export type FacilityMapFeature = Pick<
  Facility,
  'facilityId' | 'nameOfFeature' | 'topMainActivity'
> & { geometry: Point }
