<template>
  <div class="legend-wrapper">
    <div v-if="!loading && legend" class="legend-box legend-container">
      <div id="legend-title">
        <span v-if="mapDataType === mapDataTypes.GRID">
          {{ "map.legend.title.emissions.label" | translate }}
          <br />{{ "map.legend.per-grid-cell" | translate }}
          <span> ({{ legend.unit }})</span>
        </span>
        <span v-if="mapDataType === mapDataTypes.MUNICIPALITY">
          {{ "map.legend.title.emission-density.label" | translate }}
          <br />({{ legend.unit }} / km<sup>2</sup>)
        </span>
      </div>
      <div class="legend-class-row" v-for="className in legend.classNames" :key="className">
        <div
          class="legend-color-box"
          v-bind:style="{ backgroundColor: legend[className].color }"
        />
        <div v-if="className === 1">&lt; {{ toLocaleNumber(legend[className].max) }}</div>
        <div v-else>
          {{ toLocaleNumber(legend[className].min) }} -
          {{ toLocaleNumber(legend[className].max) }}
        </div>
      </div>
    </div>
    <div v-else class="legend-box loading-wrapper">
      <LoadingAnimation />
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from "vue";
import { mapState } from "vuex";
import { PollutantLegend, MapDataType } from "./../types";
import LoadingAnimation from "./LoadingAnimation.vue";

export default {
  components: {
    LoadingAnimation
  },
  props: {
    legend: { type: Object as PropType<PollutantLegend> },
    mapDataType: { type: String as PropType<MapDataType> }
  },
  computed: mapState(["loading"]),
  data() {
    return {
      mapDataTypes: Object(MapDataType)
    };
  },
  methods: {
    toLocaleNumber(n: number) {
      if (n >= 1000) {
        return n.toLocaleString("fi-FI", { useGrouping: true });
      }
      return n;
    }
  }
};
</script>

<style scoped>
.legend-wrapper {
  font-size: 13px;
}
@media (max-width: 505px) {
  .legend-wrapper {
    font-size: 12px;
    margin-top: 20px;
    margin-top: 41px;
    margin-right: -4px;
  }
}
.legend-box {
  border-radius: 5px;
  background-color: rgb(0 0 0 / 70%);
  color: white;
  box-shadow: 1px 1px 4px 2px rgba(0, 0, 0, 0.07);
}
.legend-container {
  padding: 10px 11px 10px 10px;
}
.loading-wrapper {
  padding: 10px;
}
#legend-title {
  margin: 0 0 8px 0;
  font-weight: 550;
  text-align: left;
}
.legend-class-row {
  margin: 5px 0 0 0;
  display: flex;
  align-content: center;
  justify-content: flex-start;
}
.legend-color-box {
  width: 15px;
  height: 15px;
  margin: 0 5px 0 5px;
  border: 1px solid #ffffffad;
  border-radius: 2px;
}
</style>
