<template>
  <div></div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { Vector as VectorLayer } from "ol/layer";
import VectorSource from "ol/source/Vector";
import Polygon from 'ol/geom/Polygon';
import { all as allStrategy } from "ol/loadingstrategy";
import GeoJSON from "ol/format/GeoJSON";
import { Coordinate } from "ol/coordinate";
import { Fill, Style, Stroke } from "ol/style";
import { StyleFunction } from "ol/style/Style";
import Map from "ol/Map.js";
import * as styleUtils from "./../utils/pollutantStyles";
import * as emissionService from "./../services/emissions";
import { Pollutant, PollutantLegend, MapDataType } from "../types";
import { FeatureLike } from "ol/Feature";
import { Dispatch } from "@/store";
import * as env from "./../env";

const classCount = 7;

export default Vue.extend({
  props: {
    map: { type: Object as PropType<Map> },
    year: Number,
    gnfrId: String,
    pollutant: { type: Object as PropType<Pollutant> },
    popupVisible: Boolean,
    popupCoords: { type: Array as PropType<Coordinate | undefined> }
  },
  data() {
    return {
      layerSource: new VectorSource() as VectorSource<Polygon>,
      vectorLayer: new VectorLayer() as VectorLayer<VectorSource<Polygon>>,
      colorFunction: undefined as Function | undefined,
      legend: undefined as PollutantLegend | undefined,
      densityProp: (this.pollutant.id + "-density") as string
    };
  },
  watch: {
    year: function (newVal) {
      console.log(`Year changed to ${newVal}, refreshing muni data...`);
      this.layerSource.refresh();
    },
    gnfrId: function (newVal: string) {
      console.log(`Gnfr changed to ${newVal}, refreshing muni data...`);
      this.layerSource.refresh();
    },
    pollutant: function (newVal: Pollutant) {
      console.log(`Pollutant changed to ${newVal.name["fi"]}, refreshing muni data...`);
      this.densityProp = newVal.id + "-density";
      this.colorFunction = undefined;
      this.layerSource.refresh();
    }
  },
  methods: {
    getOlStyle(): StyleFunction {
      return (feature: FeatureLike) =>
        new Style({
          fill: new Fill({
            color: this.colorFunction ? this.colorFunction(feature) : "rgba(255,255,255,0)"
          }),
          stroke: new Stroke({
            color: "black",
            width: 1
          })
        });
    },
    getMaxEmissionValue(): number {
      return Math.ceil(
        Math.max(...this.layerSource.getFeatures().map((feat) => feat.get(this.densityProp)))
      );
    },
    async updateStyle(maxEmissionValue: number): Promise<number[] | undefined> {
      if (styleUtils.hasBreakPoints(MapDataType.MUNICIPALITY, this.densityProp)) {
        const breakPoints = styleUtils.getBreakPoints(
          MapDataType.MUNICIPALITY,
          this.pollutant.id
        );
        this.colorFunction = styleUtils.getColorFunction(
          this.densityProp,
          breakPoints!,
          maxEmissionValue
        );
        return breakPoints;
      } else if (this.year === env.latestYear && this.gnfrId === "COMBINED") {
        // current layer is combined pollutants and latest year, thus breakpoints can be calculated by it
        const latestValues = this.layerSource
          .getFeatures()
          .map((feat) => feat.get(this.densityProp));

        const breakPoints = styleUtils.getPollutantBreakPoints(
          MapDataType.MUNICIPALITY,
          this.pollutant.id,
          latestValues,
          classCount
        );
        this.colorFunction = styleUtils.getColorFunction(
          this.densityProp,
          breakPoints,
          maxEmissionValue
        );
        return breakPoints;
      } else {
        // combined pollutants from latest year need to be fetched for calculating breakpoints
        console.log(`Fetching features of ${env.latestYear} and calculating breakpoints`);
        const fc = await emissionService.fetchMuniFeatures(
          env.latestYear,
          "COMBINED",
          this.pollutant.id,
          this.pollutant.coeffLegend
        );
        if (!fc) return;
        const latestValues = fc.features.map((feat) => feat.properties[this.densityProp]);
        const breakPoints = styleUtils.getPollutantBreakPoints(
          MapDataType.MUNICIPALITY,
          this.pollutant.id,
          latestValues,
          classCount
        );
        this.colorFunction = styleUtils.getColorFunction(
          this.densityProp,
          breakPoints,
          maxEmissionValue
        );
        // for some reason this async style update needs to be triggered manually
        this.vectorLayer.setStyle(this.getOlStyle());
        return breakPoints;
      }
    },
    updateLegend(breakPoints: number[], maxEmissionValue: number): void {
      // finally update legend to match the new style
      this.legend = styleUtils.getPollutantLegend(
        this.pollutant,
        breakPoints,
        maxEmissionValue
      );
      this.$emit("update-legend", this.legend);
    },
    async updateTotalEmissionStats(): Promise<void> {
      const totalEmissionStats = await emissionService.getTotalEmissionStats(
        this.year,
        this.gnfrId,
        this.pollutant
      );
      this.$emit("update-total-emission-stats", totalEmissionStats);
    },
    async setPopup(coords: Coordinate): Promise<void> {
      const feats = await this.layerSource.getFeaturesAtCoordinate(coords);
      if (feats.length > 0) {
        this.$emit("set-muni-feature-popup", coords, feats[0].getProperties());
      } else {
        console.log("no features found at coordinates -> closing popup");
        this.$emit("set-muni-feature-popup", undefined, null);
      }
    },
    setFeaturePopup(event) {
      this.setPopup(event.coordinate);
    },
    maybeUpdatePopup() {
      if (this.popupVisible && this.popupCoords) {
        this.setPopup(this.popupCoords);
      }
    },
    enableShowFeaturePopupOnClick(): void {
      this.map.on("singleclick", this.setFeaturePopup);
    },
    disableShowFeaturePopupOnClick(): void {
      this.map.un("singleclick", this.setFeaturePopup);
      this.$emit("set-muni-feature-popup", undefined, null);
    }
  },
  mounted() {
    console.log("mounting muni data:", this.pollutant.id, "of year", this.year);
    this.layerSource = new VectorSource({
      format: new GeoJSON(),
      loader: async () => {
        this.$emit("update-total-emission-stats", undefined);
        this.$store.dispatch(Dispatch.setLoading);
        const fc = await emissionService.fetchMuniFeatures(
          this.year,
          this.gnfrId,
          this.pollutant.id,
          this.pollutant.coeffLegend
        );
        if (!fc) return;
        this.layerSource.clear();
        this.layerSource.addFeatures(
          // @ts-ignore
          this.layerSource.getFormat().readFeatures(fc)
        );
        const maxEmissionValue = this.getMaxEmissionValue();
        const breakPoints = await this.updateStyle(maxEmissionValue);
        if (breakPoints) {
          this.updateLegend(breakPoints, maxEmissionValue);
          this.$store.dispatch(Dispatch.setLoaded);
        } else {
          console.error("Could not update style for the current layer");
        }
        this.updateTotalEmissionStats();
        this.maybeUpdatePopup();
      },
      strategy: allStrategy
    });

    this.vectorLayer = new VectorLayer({
      source: this.layerSource,
      style: this.getOlStyle(),
      zIndex: 11
    });
    this.map.addLayer(this.vectorLayer);
    this.enableShowFeaturePopupOnClick();
  },
  destroyed() {
    console.log("Removing muni data layer from the map");
    this.$emit("update-legend", undefined);
    this.disableShowFeaturePopupOnClick();
    this.map.removeLayer(this.vectorLayer);
  }
});
</script>
