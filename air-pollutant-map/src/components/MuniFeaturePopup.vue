<template>
  <div class="olpopup-container">
    <div class="olpopup-closer" @click="closePopup">✖</div>
    <div v-if="featProps" class="olpopup-content">
      <div class="olpopup-title">{{ featProps.name[lang] }} ({{ pollutant.name[lang] }}):</div>
      <div class="olpopup-values">
        <div class="olpopup-value-row">
          <span class="olpopup-value">
            {{ featProps[pollutant.id] ? roundPollutantValue(featProps[pollutant.id]) : 0 }}
          </span>
          <span>{{ pollutant.unitLegend }} </span>
        </div>
        <div class="olpopup-value-row">
          <span class="olpopup-value"
            >{{
              featProps[pollutant.id + "-density"]
                ? roundPollutantValue(featProps[pollutant.id + "-density"])
                : 0
            }}
          </span>
          <span>{{ pollutant.unitLegend }} / km<sup>2</sup> </span>
        </div>
      </div>
      <MuniDataDownload :featProps="featProps" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { Pollutant, MuniFeatureProperties } from "@/types";
import { mapState } from "vuex";
import MuniDataDownload from "./MuniDataDownload.vue";

export default Vue.extend({
  props: {
    pollutant: { type: Object as PropType<Pollutant> },
    featProps: { type: Object as PropType<MuniFeatureProperties> }
  },
  components: { MuniDataDownload },
  computed: mapState(["lang"]),
  methods: {
    closePopup() {
      this.$emit("close-popup");
    },
    roundPollutantValue(n: number) {
      const rounded = parseFloat(n.toPrecision(2));
      if (rounded >= 1000) {
        return rounded.toLocaleString("fi-FI", { useGrouping: true });
      }
      return rounded;
    }
  }
});
</script>

<style scoped>
.olpopup-closer {
  position: absolute;
  right: 11px;
  top: 5px;
  cursor: pointer;
  margin-bottom: 10px;
}
.olpopup-content {
  padding: 3px 22px 2px 3px;
  color: black;
  font-weight: 500;
}
.olpopup-title {
  font-weight: 550;
  margin-bottom: 6px;
}
.olpopup-values {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.olpopup-value-row {
  margin: 1px 0 1px 0;
}
.olpopup-value {
  color: #007ac9;
}
</style>
