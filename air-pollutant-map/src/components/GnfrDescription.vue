<template>
  <div class="desc-box">
    <div class="desc">
      <span class="gnfr-name">{{ gnfr && gnfr.name[lang] }}</span>
      {{ gnfr && gnfr.desc[lang] }}
      <div v-if="gnfrPollutantMetas && totalEmissionStats" class="stats">
        <span v-if="totalEmissionStats">
          <span v-if="totalEmissionStats.gnfrId === 'COMBINED' && totalEmissionStats.totalEmissions">
            {{ "gnfr.description.combined-emissions" | translate }}
            <span class="formatted-number">
              {{ roundTotalEmissions(totalEmissionStats.gnfrEmissions) }}
              {{ totalEmissionStats.unit }}
            </span></span
          ><span v-else-if="totalEmissionStats.gnfrId !== 'COMBINED' && totalEmissionStats.gnfrEmissions && totalEmissionStats.totalEmissions">
            {{ "gnfr.description.gnfr-share-of-total" | translate }}
            <span class="formatted-number">
              {{ getShareOfGnfrEmissions(totalEmissionStats) }} %
            </span>
            (<span class="formatted-number"
              >{{ roundTotalEmissions(totalEmissionStats.gnfrEmissions) }}
              {{ totalEmissionStats.unit }}</span
            >)</span
          ><span v-else-if="!totalEmissionStats.gnfrEmissions" class="no-emissions">
            {{ "gnfr.description.no_emissions" | translate }}
          </span>
          </span>
      </div>
    </div>
    <div v-if="!gnfrPollutantMetas || !totalEmissionStats" class="load-animation-container">
      <LoadingAnimation color="#007ac9" :size="17" />
    </div>
  </div>
</template>

<script lang="ts">
import { Gnfr, GnfrPollutantMeta, Pollutant, TotalEmissionStats } from "@/types";
import Vue, { PropType } from "vue";
import { mapState } from "vuex";
import { fetchGnfrPollutantMetas } from "../services/meta";
import LoadingAnimation from "./LoadingAnimation.vue";

export default Vue.extend({
  props: {
    year: Number,
    gnfr: { type: Object as PropType<Gnfr> },
    pollutant: { type: Object as PropType<Pollutant | undefined> },
    totalEmissionStats: { type: Object as PropType<TotalEmissionStats | undefined> }
  },
  computed: mapState(["lang"]),
  components: {
    LoadingAnimation
  },
  data() {
    return {
      gnfrPollutantMetas: undefined as GnfrPollutantMeta[] | undefined
    };
  },
  methods: {
    roundTotalEmissions(n: number) {
      const rounded = parseFloat(n.toPrecision(3));
      if (rounded >= 1000) {
        return rounded.toLocaleString("fi-FI", { useGrouping: true });
      }
      return rounded;
    },
    roundPercentage(n: number) {
      // round breakpoint values to at least two significant figures
      for (let i = 1; i < Math.pow(10, 10); i = i * 10) {
        const divider = 10 / i;
        if (n > divider) {
          return Math.round(n * i) / i;
        }
      }
      return n;
    },
    getShareOfGnfrEmissions(tes: TotalEmissionStats) {
      return this.roundPercentage((tes.gnfrEmissions / tes.totalEmissions) * 100);
    }
  },
  async mounted() {
    this.gnfrPollutantMetas = await fetchGnfrPollutantMetas();
  }
});
</script>

<style scoped>
.desc-box {
  margin: 0.4em 0 1.2em 0;
  padding: 0em;
  min-height: 9em;
  background-color: #fff;
}
@media (min-width: 1200px) {
  .desc-box {
    padding: 1em 1.3em;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 12px 0px;
    border-radius: 1px;
    border-left: 4px solid;
    border-image: linear-gradient(to bottom, #8c96c6, #bfd3e6) 1 100%;
    border-width: 0px 0px 0px 4px;
    min-height: unset;
  }
}
.gnfr-name {
  font-weight: 550;
  margin-right: 1px;
}
.desc {
  color: black;
}
.stats {
  margin: 7px 0px -1px 0px;
  line-height: 115%;
}
.formatted-number {
  color: #007ac9;
}
.no-emissions {
  color: #ff2346;
}
.load-animation-container {
  margin: 8px 0px -2px 2px;
}
</style>
