<template>
  <div class="map-data-type-selector-wrapper">
    <label class="visually-hidden" for="map-data-type-selector-container">
      {{ "aria.mapdatatype.selector.label" | translate }}
    </label>
    <div class="map-data-type-selector-container">
      <button
        id="selector-grid"
        :disabled="mapDataType === mapDataTypes.GRID"
        :aria-pressed="mapDataType === mapDataTypes.GRID"
        v-on:click="() => selectMapDataType(mapDataTypes.GRID)"
        v-bind:class="[
          mapDataType === mapDataTypes.GRID
            ? 'selected-data-type'
            : 'data-type-selector-hover',
          'data-type-selector-button'
        ]"
      >
        {{ "selector.map.datatype.grid" | translate }}
      </button>
      <button
        id="selector-municipalities"
        :disabled="mapDataType === mapDataTypes.MUNICIPALITY"
        :aria-pressed="mapDataType === mapDataTypes.MUNICIPALITY"
        v-on:click="() => selectMapDataType(mapDataTypes.MUNICIPALITY)"
        v-bind:class="[
          mapDataType === mapDataTypes.MUNICIPALITY
            ? 'selected-data-type'
            : 'data-type-selector-hover',
          'data-type-selector-button'
        ]"
      >
        {{ "selector.map.datatype.muni" | translate }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { MapDataType } from "@/types";

export default Vue.extend({
  props: {
    mapDataType: { type: String as PropType<MapDataType> }
  },
  data() {
    return {
      mapDataTypes: Object(MapDataType)
    };
  },
  methods: {
    selectMapDataType: function (mapDataType: MapDataType) {
      this.$emit("select-map-data-type", mapDataType);
    }
  }
});
</script>

<style scoped>
.map-data-type-selector-wrapper {
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.57);
  padding: 5px;
  font-size: 15px;
  box-shadow: 1px 1px 4px 2px rgba(0, 0, 0, 0.07);
}
@media (max-width: 516px) {
  .map-data-type-selector-wrapper {
    font-size: 13px;
    margin-bottom: 5px;
  }
}
.map-data-type-selector-container {
  display: flex;
}
.data-type-selector-button {
  background-color: white;
  border: 2px solid #949494;
  color: #949494;
  cursor: pointer;
  padding: 7px 13px;
  font-weight: 550;
  z-index: 2;
  transition-duration: 0.15s;
  -webkit-transition-duration: 0.15s; /* Safari */
}
.data-type-selector-button:focus,
.data-type-selector-button:hover {
  outline: none;
  color: black;
  box-shadow: 0pt 0pt 1pt 0pt black;
  border-color: black;
  z-index: 5;
}
#selector-municipalities {
  border-radius: 0 5px 5px 0;
}
#selector-grid {
  margin-right: -1px;
  border-radius: 5px 0 0 5px;
}
.selected-data-type,
.selected-data-type:hover {
  cursor: auto;
  color: white;
  box-shadow: none;
  border-color: #3969a1;
  background-color: rgba(0, 60, 136, 0.5);
  z-index: 3;
}
.visually-hidden {
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
}
</style>
