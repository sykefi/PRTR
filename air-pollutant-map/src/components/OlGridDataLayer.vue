<template>
  <div></div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { Vector as VectorLayer } from "ol/layer";
import VectorSource from "ol/source/Vector";
import Polygon from 'ol/geom/Polygon';
import GeoJSON from "ol/format/GeoJSON";
import { Fill, Style } from "ol/style";
import { StyleFunction } from "ol/style/Style";
import Map from "ol/Map.js";
import * as styleUtils from "./../utils/pollutantStyles";
import * as emissionService from "./../services/emissions";
import * as gridService from "./../services/grid";
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
    pollutant: { type: Object as PropType<Pollutant> }
  },
  data() {
    return {
      layerSource: new VectorSource() as VectorSource<Polygon>,
      vectorLayer: new VectorLayer() as VectorLayer<VectorSource<Polygon>>,
      colorFunction: undefined as Function | undefined,
      legend: undefined as PollutantLegend | undefined,
      cache: {} as { [key: string]: string }
    };
  },
  watch: {
    year: function (newVal) {
      console.log(`Year changed to ${newVal}, refreshing grid data...`);
      this.handleLayerUpdate();
    },
    gnfrId: function (newVal: string) {
      console.log(`Gnfr changed to ${newVal}, refreshing grid data...`);
      this.handleLayerUpdate();
    },
    pollutant: function (newVal: Pollutant) {
      console.log(`Pollutant changed to ${newVal.name["fi"]}, refreshing grid data...`);
      // this.colorFunction = undefined;
      this.handleLayerUpdate();
    }
  },
  methods: {
    getOlStyle(): StyleFunction {
      return (feature: FeatureLike) =>
        new Style({
          fill: new Fill({
            color: this.colorFunction ? this.colorFunction(feature) : "rgba(255,255,255,0)"
          })
        });
    },

    getMaxEmissionValue(): number {
      return Math.ceil(
        Math.max(
          ...this.layerSource
            .getFeatures()
            .map((feat) => feat.get("emission"))
            .filter((p) => p)
        )
      );
    },

    async handleLayerUpdate() {
      this.$store.dispatch(Dispatch.setLoading);
      this.$emit("update-total-emission-stats", undefined);
      await this.loadSourceFeatures();
      await this.handleStyleUpdate();
      await this.updateTotalEmissionStats();
    },

    async loadSourceFeatures() {
      const gridData = await emissionService.fetchGridData(
        this.year,
        this.gnfrId,
        this.pollutant.id,
        this.pollutant.coeffLegend
      );
      if (!gridData) return;

      this.layerSource.forEachFeature((feat) => {
        const emission = gridData.get(feat.get("id") as number);
        feat.setProperties({ emission });
      });
    },

    async handleStyleUpdate() {
      const maxEmissionValue = this.getMaxEmissionValue();

      const breakPoints = await this.updateStyle(maxEmissionValue);
      if (breakPoints) {
        this.updateLegend(breakPoints, maxEmissionValue);
        this.$store.dispatch(Dispatch.setLoaded);
      } else {
        console.error("Could not update style for the current layer");
      }
    },

    /**
     * Either loads or calculates breakpoints for the layer, creates style function by them and finally returns the breakpoints.
     * Returns undefined if breakpoints were not found in the end (this should not happen).
     *
     * This function is to be part of the loader function of the layer, which is called every time the layer source is refreshed (this.layerSource.refresh()).
     * The dynamic styling of the layer is based on the combined emission values of the selected pollutant (combined GNFR class of that pollutant). The style
     * function is based on breakpoints, that define minimum and maximum values for each color class. New breakpoints are calculated only if they were not
     * calculated before. If the breakponts are to be calculatd for the first time, they can be calculated from the current layer if it is the combined GNFR and
     * latest year, otherwise that layer is fetched for calculating the breakpoints. Finally, the style function of the layer is updated by the breakpoints.
     */
    async updateStyle(maxEmissionValue: number): Promise<number[] | undefined> {
      if (styleUtils.hasBreakPoints(MapDataType.GRID, this.pollutant.id)) {
        const breakPoints = styleUtils.getBreakPoints(MapDataType.GRID, this.pollutant.id);
        this.colorFunction = styleUtils.getColorFunction(
          "emission",
          breakPoints!,
          maxEmissionValue
        );
        return breakPoints;
      } else if (this.gnfrId === "COMBINED" && this.year === env.latestYear) {
        // current layer is combined emissions and latest year, thus breakpoints can be calculated by it
        const latestValues = this.layerSource
          .getFeatures()
          .map((feat) => feat.get("emission"));
        const breakPoints = styleUtils.getPollutantBreakPoints(
          MapDataType.GRID,
          this.pollutant.id,
          latestValues,
          classCount
        );
        this.colorFunction = styleUtils.getColorFunction(
          "emission",
          breakPoints,
          maxEmissionValue
        );
        return breakPoints;
      } else {
        // combined pollutants from latest year need to be fetched for calculating breakpoints
        console.log(`Fetching features of ${env.latestYear} and calculating breakpoints`);
        const gd = await emissionService.fetchGridData(
          env.latestYear,
          "COMBINED",
          this.pollutant.id,
          this.pollutant.coeffLegend
        );
        if (!gd) return;
        const latestValues = [...gd.values()];
        const breakPoints = styleUtils.getPollutantBreakPoints(
          MapDataType.GRID,
          this.pollutant.id,
          latestValues,
          classCount
        );
        this.colorFunction = styleUtils.getColorFunction(
          "emission",
          breakPoints,
          maxEmissionValue
        );
        // for some reason this async style update needs to be triggered manually
        this.vectorLayer.setStyle(this.getOlStyle());
        return breakPoints;
      }
    },

    updateLegend(breakPoints: number[], maxEmissionValue: number): void {
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

    async setFeaturePopup(event): Promise<void> {
      const feats = await this.layerSource.getFeaturesAtCoordinate(event.coordinate);
      if (feats.length > 0 && feats[0].getProperties()["emission"]) {
        this.$emit(
          "set-grid-feature-popup",
          event.coordinate,
          feats[0].getProperties()["emission"]
        );
      } else {
        console.log("no features found on click -> cannot set popup");
      }
    },

    enableShowFeaturePopupOnClick(): void {
      this.map.on("singleclick", this.setFeaturePopup);
    },

    disableShowFeaturePopupOnClick(): void {
      this.map.un("singleclick", this.setFeaturePopup);
      this.$emit("set-grid-feature-popup", undefined, null);
    }
  },
  async mounted() {
    // fetch grid geometry
    const gridFc = await gridService.fetchGridFeatures();

    this.layerSource = new VectorSource({
      format: new GeoJSON()
    });
    this.layerSource.addFeatures(
      // @ts-ignore
      this.layerSource.getFormat().readFeatures(gridFc)
    );

    this.handleLayerUpdate();

    this.vectorLayer = new VectorLayer({
      source: this.layerSource,
      style: this.getOlStyle(),
      zIndex: 12
    });

    this.map.addLayer(this.vectorLayer);
    this.enableShowFeaturePopupOnClick();
  },
  destroyed() {
    console.log("Removing grid data layer from the map");
    this.$emit("update-legend", undefined);
    this.disableShowFeaturePopupOnClick();
    this.map.removeLayer(this.vectorLayer);
  }
});
</script>
