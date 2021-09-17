import { useEffect } from 'react'
import { Feature, Map, View } from 'ol'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import municipalitiesGeoJson from '../assets/kunnat21_4-5milj_3067.json'
import { Style, Fill, Circle, Stroke } from 'ol/style'
import { easeOut } from 'ol/easing'
import { Extent } from 'ol/extent'
import Projection from 'ol/proj/Projection'
import 'ol/ol.css'
import './OlMap.css'
import { Box } from '@chakra-ui/layout'
import Geometry from 'ol/geom/Geometry'
import { Facility } from '../api/models/Facility'
import { facilitiesAsGeoJSONFC } from '../utils'

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
}

export const OlMap = (props: Props) => {
  // create/render map
  useEffect(() => {
    if (!olMap.getTarget()) {
      olMap.setTarget('map')
      setTimeout(() => {
        olMap.updateSize()
        olMap.getView().fit(initialExtent, { padding: [0, 0, 0, 0] })
        olMap.getView().setCenter([456101, 7186327])
        console.log(olMap)
      }, 200)
    }

    return () => {
      olMap.setTarget(undefined)
    }
  }, [])

  // update facility layer data
  useEffect(() => {
    if (!!props.facilities) {
      const fc = facilitiesAsGeoJSONFC(props.facilities)
      const features = facilitySource
        .getFormat()
        ?.readFeatures(fc) as Feature<Geometry>[]
      if (!!features) {
        facilitySource.addFeatures(features)
        console.log(
          'olMap.getView().calculateExtent()',
          olMap.getView().calculateExtent()
        )

        console.log('facilitySource.getExtent()', facilitySource.getExtent())

        olMap.getView().fit([418564, 6687192, 424008, 6696389])
      }
    }
    return () => {
      facilitySource.clear()
    }
  }, [props.facilities])

  return (
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
  )
}
