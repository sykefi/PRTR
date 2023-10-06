<template>
  <div class="select-wrapper">
    <CustomDropdownSelector
      v-if="options && initialOption"
      uniqueSelectorId="pollutant"
      :selectorLabel="'selector.pollutant.label' | translate"
      :options="options"
      :initialOption="initialOption"
      @selected-option="(option) => $emit('selected-pollutant', option.value)"
    />
    <div v-else class="loading-container"><LoadingAnimation color="#007ac9" :size="22" /></div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Option } from "./../types";
import { fetchPollutantMeta } from "./../services/meta";
import CustomDropdownSelector from "./CustomDropdownSelector.vue";
import LoadingAnimation from "./LoadingAnimation.vue";

export default Vue.extend({
  components: {
    CustomDropdownSelector,
    LoadingAnimation
  },
  data() {
    return {
      options: undefined as Option[] | undefined,
      initialOption: undefined as Option | undefined
    };
  },
  methods: {
    async loadPollutantOptions() {
      const pollutantOptions = await fetchPollutantMeta();
      if (!pollutantOptions) return;
      this.options = pollutantOptions.map((p) => {
        return {
          id: p.id,
          label: p.name,
          value: p,
          showFirst: false
        } as Option;
      });
      this.initialOption = this.options.find((o) => o.id === "s16");
    }
  },
  mounted() {
    this.loadPollutantOptions();
  },
  destroyed() {
    this.$emit("selected-pollutant", undefined);
  }
});
</script>

<style scoped>
.select-wrapper {
  width: 265px;
}
.loading-container {
  margin-top: 27px;
}
</style>
