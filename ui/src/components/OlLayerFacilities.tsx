import { useCallback, useEffect } from 'react'
import { Feature, Map } from 'ol'
import Select, { SelectEvent } from 'ol/interaction/Select'
import Geometry from 'ol/geom/Geometry'
import VectorSource from 'ol/source/Vector'
import { easeOut } from 'ol/easing'
import { Facility } from '../api/models/Facility'
import { facilitiesAsGeoJSONFC } from '../utils'
import { FacilityMapFeature } from '../models/FacilityMapFeature'

let zoomDelay: null | ReturnType<typeof setTimeout> = null

interface Props {
  olMap: Map
  facilities: Facility[]
  facilitySource: VectorSource<Geometry>
  setPopupData: (f: FacilityMapFeature | null) => void
  zoomToInitialExtent: boolean
}

export const OlLayerFacilities = ({
  olMap,
  facilities,
  facilitySource,
  setPopupData,
  zoomToInitialExtent
}: Props) => {
  const handleCreatePopupOnSelect = useCallback(
    async (event: SelectEvent) => {
      const selectedFacility =
        event.selected.length > 0
          ? (event.selected[0].getProperties() as FacilityMapFeature)
          : null
      setPopupData(selectedFacility)
      console.log('select event', event, selectedFacility)
      console.log(selectedFacility ? 'selected' : 'cleared selection')
    },
    [setPopupData]
  )

  useEffect(() => {
    // add/update facilities to map
    const select = new Select({
      layers: l => l.get('name') === 'facilities'
    })
    if (!!facilities) {
      const features = facilitySource
        .getFormat()
        ?.readFeatures(facilitiesAsGeoJSONFC(facilities)) as Feature<Geometry>[]
      if (!!features) {
        facilitySource.addFeatures(features)
        if (!zoomToInitialExtent) {
          zoomDelay = setTimeout(() => {
            olMap.getView().fit(facilitySource.getExtent(), {
              duration: 1000,
              maxZoom: 3.3,
              padding: [100, 100, 100, 100],
              easing: easeOut
            })
          }, 100)
        }
      }
      // setup popup handling
      olMap.addInteraction(select)
      select.on('select', handleCreatePopupOnSelect)
    }
    return () => {
      console.log('clear facilities layer')
      olMap.removeInteraction(select)
      select.un('select', handleCreatePopupOnSelect)
      if (!!zoomDelay) clearTimeout(zoomDelay)
      facilitySource.clear()
    }
  }, [
    handleCreatePopupOnSelect,
    olMap,
    facilities,
    facilitySource,
    zoomToInitialExtent
  ])

  return null
}
