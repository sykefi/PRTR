<template>
  <div id="app-wrapper">
    <div id="app-container">
      <div id="info-panel">
        <div id="selector-panel">
          <SelectorYear @selected-year="(year) => (this.year = year)" />
          <SelectorGnfr
            :mapDataType="mapDataType"
            @selected-gnfr="(gnfr) => (this.gnfr = gnfr)"
          />
          <SelectorPollutant @selected-pollutant="(p) => (this.pollutant = p)" />
        </div>
        <div v-if="gnfr" id="gnfr-desc">
          <GnfrDescription
            :year="year"
            :gnfr="gnfr"
            :pollutant="pollutant"
            :totalEmissionStats="totalEmissionStats"
          />
        </div>
      </div>
      <div id="map-container">
        <OlMap
          :year="year"
          :gnfrId="gnfr ? gnfr.id : undefined"
          :pollutant="pollutant"
          :mapDataType="mapDataType"
          @update-total-emission-stats="(tes) => (this.totalEmissionStats = tes)"
        />
        <div id="map-controls-container">
          <ToggleLanguageButtons />
        </div>
      </div>
      <MuniDataDownloadAll v-if="downloadFullDataEnabled" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import OlMap from "./components/OlMap.vue";
import SelectorYear from "./components/SelectorYear.vue";
import ToggleDataType from "./components/ToggleDataType.vue";
import SelectorPollutant from "./components/SelectorPollutant.vue";
import SelectorGnfr from "./components/SelectorGnfr.vue";
import ToggleLanguageButtons from "./components/ToggleLanguageButtons.vue";
import GnfrDescription from "./components/GnfrDescription.vue";
import MuniDataDownloadAll from "./components/MuniDataDownloadAll.vue";
import { Pollutant, MapDataType, Gnfr, TotalEmissionStats } from "./types";
import { Dispatch } from "./store";
import * as env from "./env";

export default Vue.extend({
  components: {
    OlMap,
    SelectorYear,
    SelectorGnfr,
    SelectorPollutant,
    ToggleDataType,
    ToggleLanguageButtons,
    GnfrDescription,
    MuniDataDownloadAll
  },
  data() {
    return {
      year: env.latestYear as number,
      gnfr: undefined as Gnfr | undefined,
      pollutant: undefined as Pollutant | undefined,
      mapDataType: MapDataType.GRID as MapDataType,
      totalEmissionStats: undefined as TotalEmissionStats | undefined,
      downloadFullDataEnabled: env.downloadFullDataEnabled as boolean
    };
  },
  beforeCreate() {
    this.$store.dispatch(Dispatch.loadSetInitialLang);
  }
});
</script>

<style scoped>
#app-wrapper {
  display: flex;
  align-content: center;
  justify-content: center;
  font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
  font-size: 15px;
  width: 100%;
  line-height: initial;
}
#app-container {
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  width: 100%;
  max-width: 556px;
}
@media (min-width: 1200px) {
  #app-container {
    flex-direction: row;
    max-width: unset;
    padding-top: 10px;
  }
}
#info-panel {
  max-width: 610px;
}
#selector-panel {
  width: 100%;
  display: flex;
  z-index: 5;
}
@media (max-width: 516px) {
  #selector-panel {
    flex-wrap: wrap;
  }
}
@media (min-width: 1200px) {
  #selector-panel {
    padding: 0px 0px 0px 5px;
  }
}
#gnfr-desc {
  width: 100%;
  display: flex;
}
@media (min-width: 1200px) {
  #gnfr-desc {
    width: calc(100% - 18px);
    padding-left: 2px;
  }
}
#map-container {
  position: relative;
  width: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  box-shadow: rgba(0, 0, 0, 0.08) 0px 2px 12px 0px;
}
@media (min-width: 1200px) {
  #map-container {
    margin-top: 7px;
    width: calc(100% - 600px);
    max-width: 900px;
    box-shadow: rgba(0, 0, 0, 0.12) 0px 2px 12px 0px;
  }
}
#map-controls-container {
  position: absolute;
  display: flex;
  flex-wrap: wrap;
  top: 9px;
  left: 50px;
}
</style>
