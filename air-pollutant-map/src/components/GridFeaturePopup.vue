<template>
  <div class="olpopup-container">
    <div class="olpopup-closer" @click="closePopup">✖</div>
    <div class="olpopup-content">
      <div class="olpopup-title">{{ pollutant.name[lang] }} ({{ pollutant.unitLegend }}):</div>
      <div class="olpopup-value">
        <span class="olpopup-value">{{
          popupValue ? roundPollutantValue(popupValue) : 0
        }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { Pollutant } from "@/types";
import { mapState } from "vuex";

export default Vue.extend({
  props: {
    pollutant: { type: Object as PropType<Pollutant> },
    popupValue: Number
  },
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
/* Close popup button */
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
  font-weight: 550;
}
.olpopup-title {
  margin-bottom: 4px;
}
.olpopup-value {
  font-weight: 500;
  color: #007ac9;
}
</style>
