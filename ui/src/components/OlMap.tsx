import { useEffect, useRef, useState } from 'react'
import { CloseButton } from '@chakra-ui/close-button'
import { Map, Overlay, View } from 'ol'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import { Style, Fill, Stroke } from 'ol/style'
import { Extent } from 'ol/extent'
import Projection from 'ol/proj/Projection'
import { easeOut } from 'ol/easing'
import 'ol/ol.css'
import './OlMap.css'
import { Box, Flex } from '@chakra-ui/layout'
import { FacilityMapFeature } from '../models/FacilityMapFeature'
import municipalitiesGeoJson from '../assets/kunnat21_4-5milj_3067.json'
import { Facility } from '../api/models/Facility'
import { facilityLayer, OlLayerFacilities } from './OlLayerFacilities'
import { FacilityMapPopupContent } from './FacilityMapPopupContent'

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

const popupOverlay = new Overlay({
  autoPan: true, // If the pop-up window is at the edge of the base image, the base image will move
  autoPanAnimation: {
    // Basemap moving animation
    duration: 250
  }
})

olMap.on('pointermove', e => {
  const pixel = olMap.getEventPixel(e.originalEvent)
  const hit = olMap.hasFeatureAtPixel(pixel, {
    layerFilter: l => l.get('name') === 'facilities'
  })
  const canvas = document.querySelector('canvas')
  if (canvas) {
    canvas.style.cursor = hit ? 'pointer' : ''
  }
})

interface Props {
  facilities?: Facility[]
  width?: number
  margin?: number
  height?: string | number
  zoomToInitialExtent: boolean
}

export const OlMap = (props: Props) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const popupRef = useRef<HTMLDivElement>(null)
  const [mapIsRendered, setMapIsRendered] = useState(false)
  const [popupData, setPopupData] = useState<FacilityMapFeature | null>(null)

  useEffect(() => {
    // initialize popup overlay when the target element mounts in the DOM
    if (popupRef.current) {
      olMap.addOverlay(popupOverlay)
      popupOverlay.setElement(popupRef.current)
    }
    return () => {
      setPopupData(null)
      popupOverlay.setElement(undefined)
      popupOverlay.setPosition(undefined)
      olMap.removeOverlay(popupOverlay)
    }
  }, [popupRef])

  useEffect(() => {
    // update/clear popup location when popupData is changed
    if (mapIsRendered) {
      if (popupData) {
        popupOverlay.setPosition(popupData.geometry.getCoordinates())
      } else {
        popupOverlay.setPosition(undefined)
      }
    }
  }, [popupData, mapIsRendered])

  useEffect(() => {
    // initialize map
    let renderDelay: null | ReturnType<typeof setTimeout> = null
    if (!olMap.getTarget() && mapRef.current) {
      olMap.setTarget(mapRef.current)
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
  }, [mapRef])

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
    <Box
      ref={mapRef}
      border="2px solid white"
      width={props.width || '600px'}
      minWidth={250}
      maxWidth="100%"
      margin={props.margin || 0}
      height={props.height || 'max(600px, calc(100vh - 345px))'}
      maxHeight={props.height || 1000}
      background="white"
      borderRadius="md"
      boxShadow="md">
      <Box
        ref={popupRef}
        className="ol-popup"
        visibility={popupData ? 'unset' : 'hidden'}
        p={4}>
        <Flex>
          <Box flex={1}>
            {popupData && <FacilityMapPopupContent popupData={popupData} />}
          </Box>
          <Box>
            <CloseButton onClick={() => setPopupData(null)} />
          </Box>
        </Flex>
      </Box>
      {mapIsRendered && !!facilityCount && (
        <OlLayerFacilities
          olMap={olMap}
          facilities={props.facilities!}
          popupData={popupData}
          setPopupData={setPopupData}
          zoomToInitialExtent={props.zoomToInitialExtent}
        />
      )}
    </Box>
  )
}
