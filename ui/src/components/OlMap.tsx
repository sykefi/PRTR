import { useEffect, useState } from 'react'
import { Map, View } from 'ol'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import { Style, Fill, Circle, Stroke } from 'ol/style'
import { Extent } from 'ol/extent'
import Projection from 'ol/proj/Projection'
import { easeOut } from 'ol/easing'
import 'ol/ol.css'
import './OlMap.css'
import { Box } from '@chakra-ui/layout'
import municipalitiesGeoJson from '../assets/kunnat21_4-5milj_3067.json'
import { Facility } from '../api/models/Facility'
import { OlLayerFacilities } from './OlLayerFacilities'

const initialExtent = [-32010, 6570316, 902780, 7835076] as Extent

const etrsTm35Fin = new Projection({
  code: 'EPSG:3067',
  extent: [50199.4814, 6582464.0358, 761274.6247, 7799839.8902],
  global: false,
  metersPerUnit: 1
})

const baseLayer = new VectorLayer({
  zIndex: 1,
  source: new VectorSource({
    features: new GeoJSON().readFeatures(municipalitiesGeoJson)
  }),
  style: new Style({
    fill: new Fill({
      color: 'rgb(242, 242, 242)'
    }),
    stroke: new Stroke({
      color: 'rgb(230, 230, 230)',
      width: 1
    })
  })
})

const facilitySource = new VectorSource({
  format: new GeoJSON()
})

const facilityLayer = new VectorLayer({
  zIndex: 2,
  source: facilitySource,
  style: new Style({
    image: new Circle({
      radius: 5,
      fill: new Fill({ color: 'rgba(0, 136, 255, 0.3)' }),
      stroke: new Stroke({
        color: '#0073d8',
        width: 1.5
      })
    })
  })
})

let renderDelay: null | ReturnType<typeof setTimeout> = null

const olMap = new Map({
  target: undefined,
  layers: [baseLayer, facilityLayer],
  view: new View({
    projection: etrsTm35Fin,
    center: [435385, 7247696],
    extent: [-266488, 6468916, 1137258, 7903739],
    zoom: 1.5
  })
})

interface Props {
  facilities?: Facility[]
  zoomToInitialExtent: boolean
}

export const OlMap = (props: Props) => {
  const [mapIsRendered, setMapIsRendered] = useState(false)

  useEffect(() => {
    if (!olMap.getTarget()) {
      olMap.setTarget('map')
      renderDelay = setTimeout(() => {
        olMap.updateSize()
        setMapIsRendered(true)
      }, 100)
    }
    return () => {
      olMap.setTarget(undefined)
      if (!!renderDelay) clearTimeout(renderDelay)
      setMapIsRendered(false)
    }
  }, [])

  useEffect(() => {
    if (mapIsRendered && props.zoomToInitialExtent) {
      olMap.getView().fit(initialExtent, {
        padding: [100, 100, 100, 100],
        duration: 1000,
        easing: easeOut
      })
    }
  }, [mapIsRendered, props.zoomToInitialExtent])

  const facilityCount = props.facilities?.length

  return (
    <>
      <Box
        id="map"
        width="600px"
        minWidth="290px"
        maxWidth="100%"
        height={{ base: '500px', md: '700px' }}
        background="white"
        borderRadius="md"
        marginTop={1}
        boxShadow="sm"
      />
      {mapIsRendered && !!facilityCount && (
        <OlLayerFacilities
          olMap={olMap}
          facilities={props.facilities!}
          facilitySource={facilitySource}
          zoomToInitialExtent={props.zoomToInitialExtent}
        />
      )}
    </>
  )
}
