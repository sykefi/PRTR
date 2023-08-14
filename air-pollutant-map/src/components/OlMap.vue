<template>
  <div>
    <div id="ol-map">
      <!-- <OlMuniBasemapLayer v-if="isReady" :visible="true" :map="map" /> -->
      <OlGridDataLayer
        v-if="gnfrId && pollutant && isReady && mapDataType === mapDataTypes.GRID"
        :year="year"
        :gnfrId="gnfrId"
        :pollutant="pollutant"
        :map="map"
        @update-legend="updateLegend"
        @set-grid-feature-popup="setGridFeaturePopup"
        @update-total-emission-stats="(tps) => $emit('update-total-emission-stats', tps)"
      />
    </div>
    <Legend id="map-legend-container" :legend="legend" :mapDataType="mapDataType" />
    <div class="olpopup" ref="olpopup" v-show="gridPopupValue || muniPopupVisible">
      <div class="popup-loading-wrapper" v-show="muniPopupLoading">
        <LoadingAnimation color="#007ac9" :size="25" />
      </div>
      <GridFeaturePopup
        v-if="gridPopupValue"
        :popupValue="gridPopupValue"
        :pollutant="pollutant"
        @close-popup="closePopup"
      />
      <MuniFeaturePopup
        v-if="muniPopupFeat"
        :featProps="muniPopupFeat"
        :pollutant="pollutant"
        @close-popup="closePopup"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import Map from "ol/Map.js";
import View from "ol/View.js";
import { Tile as TileLayer } from 'ol/layer';
import WMTS from "ol/source/WMTS";
import WMTSTileGrid from "ol/tilegrid/WMTS";
import TileWMS from "ol/source/TileWMS";
import Overlay from "ol/Overlay";
import { Coordinate } from "ol/coordinate";
import { Extent } from "ol/extent";
import OlGridDataLayer from "./OlGridDataLayer.vue";
// import OlMuniBasemapLayer from "./OlMuniBasemapLayer.vue";
import GridFeaturePopup from "./GridFeaturePopup.vue";
import MuniFeaturePopup from "./MuniFeaturePopup.vue";
import LoadingAnimation from "./LoadingAnimation.vue";
import Legend from "./Legend.vue";
import { Pollutant, MapDataType, MuniFeatureProperties } from "@/types";
import { PollutantLegend } from "../types";
import Projection from "ol/proj/Projection";

const projection = new Projection({
  code: "EPSG:3067",
  extent: [50199.4814, 6582464.0358, 761274.6247, 7799839.8902],
  global: false,
  metersPerUnit: 1
});

export default Vue.extend({
  components: {
    OlGridDataLayer,
    // OlMuniBasemapLayer,
    GridFeaturePopup,
    MuniFeaturePopup,
    LoadingAnimation,
    Legend
  },
  props: {
    year: Number,
    gnfrId: String,
    pollutant: { type: Object as PropType<Pollutant | undefined> },
    mapDataType: { type: String as PropType<MapDataType> }
  },
  data() {
    return {
      map: undefined as Map | undefined,
      isReady: false as boolean,
      mapDataTypes: Object(MapDataType),
      overlay: null as Overlay | null,
      popupCoords: undefined as Coordinate | undefined,
      gridPopupValue: null as number | null,
      muniPopupVisible: false as boolean,
      muniPopupLoading: false as boolean,
      muniPopupFeat: null as MuniFeatureProperties | null,
      legend: undefined as PollutantLegend | undefined
    };
  },
  watch: {
    year() {
      this.handlePopupOnLayerChange();
    },
    gnfrId() {
      this.handlePopupOnLayerChange();
    },
    pollutant() {
      this.handlePopupOnLayerChange();
    }
  },
  methods: {
    handlePopupOnLayerChange() {
      if (this.mapDataType === MapDataType.GRID) {
        this.closePopup();
      } else {
        // a popup update is triggered in muni data layer, thus set loading=true
        this.muniPopupFeat = null;
        this.muniPopupLoading = true;
      }
    },
    updateLegend(legend: PollutantLegend) {
      this.legend = legend;
    },
    initializePopup() {
      this.overlay = new Overlay({
        // @ts-ignore
        element: this.$refs.olpopup, // popup tag, in html
        autoPan: true, // If the pop-up window is at the edge of the base image, the base image will move
        autoPanAnimation: {
          // Basemap moving animation
          duration: 250
        }
      });
      if (this.map) {
        this.map.addOverlay(this.overlay);
      }
    },
    setGridFeaturePopup(coordinate: Coordinate | undefined, value: number | null) {
      this.gridPopupValue = value;
      setTimeout(() => {
        // Set the timer here, otherwise the pop-up window will appear for the first time, and the base map will be off-track
        if (this.overlay) {
          this.overlay.setPosition(coordinate);
          this.popupCoords = coordinate;
        }
      }, 0);
    },
    setMuniFeaturePopup(
      coordinate: Coordinate | undefined,
      value: MuniFeatureProperties | null
    ) {
      this.muniPopupFeat = value;
      this.muniPopupVisible = value ? true : false;
      setTimeout(() => {
        if (this.overlay) {
          this.overlay.setPosition(coordinate);
          this.popupCoords = coordinate;
          this.muniPopupLoading = false;
        }
      }, 0);
    },
    closePopup() {
      // Set the position of the pop-up window to undefined, and clear the coordinate data
      if (this.overlay) {
        this.overlay.setPosition(undefined);
      }
      this.muniPopupVisible = false;
      this.popupCoords = undefined;
      this.gridPopupValue = null;
      this.muniPopupFeat = null;
    }
  },
  mounted() {
    const areaSize = 2097152; // width and height of the matrix set in ground (from capabilities)
    const tileSize = 256; // width and height of the tile in pixels (from capabilities)
    const matrixIds = new Array(18);
    const resolutions = new Array(18);
    const proxyUrl = "https://paikkatieto.ymparisto.fi/proxy/proxy.ashx?";

    for (let z = 0; z < 16; ++z) {
      matrixIds[z] = z;
      resolutions[z] = areaSize / tileSize / Math.pow(2, z);
    }


    const baseLayer = new TileLayer({
      zIndex: 3,
      source: new TileWMS({
        url: "http://kkxgeot1.env.fi/geoserver/ilmo-climateguide/" + "ows",
        params: { LAYERS: "shoreline", TILED: true },
        serverType: "geoserver",
        attributions: "© MML, 2011",
      }),
    });

    this.map = new Map({
      target: "ol-map",
      layers: [baseLayer],
      view: new View({
        projection,
        center: [435385.0836878328, 7247696.528687431],
        extent: [-166488.7651729983, 6568916.617733785, 1037258.9325486642, 7903739.064762917],
        zoom: 1.5
      })
    });
    this.map.once("postrender", () => {
      this.isReady = true;
      const extent = [
        -32010.40984326898,
        6590316.535987211,
        902780.5772189347,
        7905076.52138765
      ] as Extent;
      this.map!.getView().fit(extent, { padding: [15, 0, 0, 0] });
    });
    this.initializePopup();
    console.log("map", this.map);
  }
});
</script>

<style scoped>
@import "~ol/ol.css";
#ol-map {
  height: calc(100vh - 260px);
  width: 100%;
  z-index: 0;
}
@media (max-height: 900px) {
  #ol-map {
    height: max(70vh, 400px);
  }
}
@media (max-width: 516px) {
  #ol-map {
    background-color: #fbfbfb;
  }
}
@media (min-width: 1200px) {
  #ol-map {
    height: calc(100vh - 44px);
  }
}
#map-legend-container {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
}
.popup-loading-wrapper {
  padding: 12px 10px 9px 10px;
}
/* Pop-up window style */
.olpopup {
  min-width: max-content;
  position: absolute;
  background: #fff;
  padding: 8px 16px;
  border-radius: 10px;
  border: 1px solid #cccccc;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  transform: translate(-50%, calc(-100% - 12px));
}
/* The small triangle below the pop-up window */
.olpopup:after,
.olpopup:before {
  display: block;
  content: "";
  width: 0;
  height: 0;
  position: absolute;
  border: 12px solid transparent;
  border-top-color: #fff;
  bottom: -23px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
