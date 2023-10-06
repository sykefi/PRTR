<template>
  <div></div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { Vector as VectorLayer } from "ol/layer";
import VectorSource from "ol/source/Vector";
import Polygon from 'ol/geom/Polygon';
import GeoJSON from "ol/format/GeoJSON";
import { Fill, Style, Stroke } from "ol/style";
import Map from "ol/Map.js";
import * as emissionService from "./../services/emissions";

export default Vue.extend({
  props: {
    map: { type: Object as PropType<Map> },
    visible: Boolean
  },
  data() {
    return {
      layerSource: new VectorSource({ format: new GeoJSON() }) as VectorSource<Polygon>,
      vectorLayer: new VectorLayer({ zIndex: 1 }) as VectorLayer<VectorSource<Polygon>>
    };
  },
  watch: {
    visible(newVal) {
      this.vectorLayer.setVisible(newVal);
    }
  },
  methods: {
    getStyle(): Style {
      return new Style({
        fill: new Fill({
          color: "rgba(255,255,255,1)"
        }),
        stroke: new Stroke({
          color: "#e8e8e8",
          width: 2,
          lineJoin: "miter"
        })
      });
    },
    async loadSourceData() {
      // let's just fetch any municipality emission layer as the basemap featureset
      const fc = await emissionService.fetchMuniFeatures(2015, "COMBINED", "s16");
      this.layerSource.addFeatures(
        // @ts-ignore
        this.layerSource.getFormat().readFeatures(fc)
      );
    },
    async initializeLayer() {
      this.vectorLayer.setSource(this.layerSource);
      this.vectorLayer.setStyle(this.getStyle());
      this.map.addLayer(this.vectorLayer);
    }
  },
  async mounted() {
    await this.loadSourceData();
    this.initializeLayer();
  }
});
</script>
