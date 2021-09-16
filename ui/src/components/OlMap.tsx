import { useEffect } from 'react'
import { Map, View } from 'ol'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import municipalitiesGeoJson from '../assets/kunnat21_4-5milj_3067.json'
import Style from 'ol/style/Style'
import Fill from 'ol/style/Fill'
import { Extent } from 'ol/extent'
import Projection from 'ol/proj/Projection'
import 'ol/ol.css'
import './OlMap.css'
import { Box } from '@chakra-ui/layout'

const initialExtent = [-32010, 6570316, 902780, 7835076] as Extent

const etrsTm35Fin = new Projection({
  code: 'EPSG:3067',
  extent: [50199.4814, 6582464.0358, 761274.6247, 7799839.8902],
  global: false,
  metersPerUnit: 1
})

const baseLayer = new VectorLayer({
  zIndex: 10,
  source: new VectorSource({
    features: new GeoJSON().readFeatures(municipalitiesGeoJson)
  }),
  style: new Style({
    fill: new Fill({
      color: 'rgb(242, 242, 242)'
    })
  })
})

const olMap = new Map({
  target: undefined,
  layers: [baseLayer],
  view: new View({
    projection: etrsTm35Fin,
    center: [435385, 7247696],
    extent: [-266488, 6468916, 1137258, 7903739],
    zoom: 1.5
  })
})

export const OlMap = () => {
  useEffect(() => {
    olMap.setTarget('map')
    setTimeout(() => {
      olMap.updateSize()
      olMap.getView().fit(initialExtent, { padding: [0, 0, 0, 0] })
      olMap.getView().setCenter([456101, 7186327])
      console.log('olMap', olMap)
    }, 200)

    return () => {
      olMap.setTarget(undefined)
    }
  }, [])

  return (
    <Box
      id="map"
      width="600px"
      minWidth="290px"
      maxWidth="100%"
      height="100%"
      maxHeight="70vh"
      minHeight={{ base: '500px', md: '700px' }}
      background=" white"
      borderRadius="md"
      marginTop={1}
      boxShadow="sm"
    />
  )
}
