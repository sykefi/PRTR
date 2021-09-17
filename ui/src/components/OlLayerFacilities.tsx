import { useEffect } from 'react'
import { Feature, Map } from 'ol'
import Geometry from 'ol/geom/Geometry'
import VectorSource from 'ol/source/Vector'
import { easeOut } from 'ol/easing'
import { Facility } from '../api/models/Facility'
import { facilitiesAsGeoJSONFC } from '../utils'

let zoomDelay: null | ReturnType<typeof setTimeout> = null

interface Props {
  olMap: Map
  facilities: Facility[]
  facilitySource: VectorSource<Geometry>
  zoomToInitialExtent: boolean
}

export const OlLayerFacilities = (props: Props) => {
  useEffect(() => {
    if (!!props.facilities) {
      const features = props.facilitySource
        .getFormat()
        ?.readFeatures(
          facilitiesAsGeoJSONFC(props.facilities)
        ) as Feature<Geometry>[]
      if (!!features) {
        props.facilitySource.addFeatures(features)
        if (!props.zoomToInitialExtent) {
          zoomDelay = setTimeout(() => {
            props.olMap.getView().fit(props.facilitySource.getExtent(), {
              duration: 1000,
              maxZoom: 3.3,
              padding: [100, 100, 100, 100],
              easing: easeOut
            })
          }, 100)
        }
      }
    }
    return () => {
      if (!!zoomDelay) clearTimeout(zoomDelay)
      props.facilitySource.clear()
    }
  }, [
    props.olMap,
    props.facilities,
    props.facilitySource,
    props.zoomToInitialExtent
  ])

  return null
}
