import { useCallback, useEffect, useRef } from 'react'
import { Feature, Map } from 'ol'
import Select, { SelectEvent } from 'ol/interaction/Select'
import Geometry from 'ol/geom/Geometry'
import GeoJSON from 'ol/format/GeoJSON'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { easeOut } from 'ol/easing'
import { StyleFunction } from 'ol/style/Style'
import { FeatureLike } from 'ol/Feature'
import { Style, Fill, Circle, Stroke, Text } from 'ol/style'
import {
  FacilityWithCoordinates,
  hasPersonalData
} from '../api/models/Facility'
import { facilitiesAsGeoJSONFC } from '../utils'
import { FacilityMapFeature } from '../models/FacilityMapFeature'
import {
  fillColorByTopMainActivity,
  strokeColorByTopMainActivity,
  symbolByTopMainActivity
} from '../constants'
import { FacilityTopMainActivity } from '../api/enums/FacilityTopMainActivity'

let zoomDelay: null | ReturnType<typeof setTimeout> = null

const styleFunction: StyleFunction = (feature: FeatureLike) => [
  new Style({
    image: new Circle({
      radius: 10,
      fill: new Fill({
        color:
          fillColorByTopMainActivity[
            feature.get('topMainActivity') as FacilityTopMainActivity
          ] || 'rgba(255,255,255,0)'
      }),
      stroke: new Stroke({
        color:
          strokeColorByTopMainActivity[
            feature.get('topMainActivity') as FacilityTopMainActivity
          ] || 'rgba(255,255,255,0)',
        width: 1.5
      })
    })
  }),
  new Style({
    text: new Text({
      text: symbolByTopMainActivity[
        feature.get('topMainActivity') as FacilityTopMainActivity
      ],
      font: '12px "Segoe UI Emoji", sans-serif'
    })
  })
]

const facilitySource = new VectorSource({
  format: new GeoJSON()
})

const facilitySourcePersonalData = new VectorSource({
  format: new GeoJSON()
})

export const facilityLayer = new VectorLayer({
  zIndex: 2,
  source: facilitySource,
  style: styleFunction
})
facilityLayer.set('name', 'facilities')

export const facilityLayerPersonalData = new VectorLayer({
  zIndex: 3,
  source: facilitySourcePersonalData,
  style: styleFunction,
  maxZoom: 2
})
facilityLayerPersonalData.set('name', 'facilitiesPersonalData')

export const OlLayerFacilities = ({
  olMap,
  facilities,
  popupData,
  setPopupData,
  zoomToInitialExtent
}: {
  olMap: Map
  facilities: FacilityWithCoordinates[]
  popupData: FacilityMapFeature | null
  setPopupData: (f: FacilityMapFeature | null) => void
  zoomToInitialExtent: boolean
}) => {
  const selectInteraction = useRef(
    new Select({
      layers: l => l.get('name') === 'facilities'
    })
  )

  const handleCreatePopupOnSelect = useCallback(
    async (event: SelectEvent) => {
      const selectedFacility =
        event.selected.length > 0
          ? (event.selected[0].getProperties() as FacilityMapFeature)
          : null
      setPopupData(selectedFacility)
    },
    [setPopupData]
  )

  useEffect(() => {
    if (!popupData) {
      selectInteraction.current.getFeatures().clear()
    }
  }, [popupData])

  useEffect(() => {
    // add/update facilities to map
    const select = selectInteraction.current

    if (!!facilities) {
      const features = facilitySource
        .getFormat()
        ?.readFeatures(
          facilitiesAsGeoJSONFC(facilities.filter(f => !hasPersonalData(f)))
        ) as Feature<Geometry>[]
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
      select.un('select', handleCreatePopupOnSelect)
      olMap.removeInteraction(select)
      if (!!zoomDelay) clearTimeout(zoomDelay)
      facilitySource.clear()
    }
  }, [handleCreatePopupOnSelect, olMap, facilities, zoomToInitialExtent])

  return null
}

export const OlLayerFacilitiesPersonalData = ({
  olMap,
  facilities,
  popupData,
  setPopupData,
  zoomToInitialExtent
}: {
  olMap: Map
  facilities: FacilityWithCoordinates[]
  popupData: FacilityMapFeature | null
  setPopupData: (f: FacilityMapFeature | null) => void
  zoomToInitialExtent: boolean
}) => {
  const selectInteraction = useRef(
    new Select({
      layers: l => l.get('name') === 'facilitiesPersonalData'
    })
  )

  const handleCreatePopupOnSelect = useCallback(
    async (event: SelectEvent) => {
      const selectedFacility =
        event.selected.length > 0
          ? (event.selected[0].getProperties() as FacilityMapFeature)
          : null
      setPopupData(selectedFacility)
    },
    [setPopupData]
  )

  useEffect(() => {
    if (!popupData) {
      selectInteraction.current.getFeatures().clear()
    }
  }, [popupData])

  useEffect(() => {
    // add/update facilities to map
    const select = selectInteraction.current

    if (!!facilities) {
      const features = facilitySourcePersonalData
        .getFormat()
        ?.readFeatures(
          facilitiesAsGeoJSONFC(facilities.filter(f => hasPersonalData(f)))
        ) as Feature<Geometry>[]
      if (!!features) {
        facilitySourcePersonalData.addFeatures(features)
        if (!zoomToInitialExtent) {
          zoomDelay = setTimeout(() => {
            olMap.getView().fit(facilitySourcePersonalData.getExtent(), {
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
      select.un('select', handleCreatePopupOnSelect)
      olMap.removeInteraction(select)
      if (!!zoomDelay) clearTimeout(zoomDelay)
      facilitySourcePersonalData.clear()
    }
  }, [handleCreatePopupOnSelect, olMap, facilities, zoomToInitialExtent])

  return null
}
