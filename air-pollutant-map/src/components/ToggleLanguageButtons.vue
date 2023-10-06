<template>
  <div>
    <label class="visually-hidden" for="lang-selector-wrapper">
      {{ "aria.language.selector.label" | translate }}
    </label>
    <div class="lang-selector-wrapper">
      <div style="display: flex;">
        <button
          class="selector-left"
          :disabled="lang === Lang.FI"
          :aria-pressed="lang === Lang.FI"
          v-on:click="() => setLanguage(Lang.FI)"
          v-bind:class="[
            lang === Lang.FI ? 'selected-lang' : 'lang-button-hover',
            'lang-button'
          ]"
        >
          FI
        </button>
        <button
          class="selector-middle"
          :disabled="lang === Lang.SV"
          :aria-pressed="lang === Lang.SV"
          v-on:click="() => setLanguage(Lang.SV)"
          v-bind:class="[
            lang === Lang.SV ? 'selected-lang' : 'lang-button-hover',
            'lang-button'
          ]"
        >
          SV
        </button>
        <button
          class="selector-right"
          :disabled="lang === Lang.EN"
          :aria-pressed="lang === Lang.EN"
          v-on:click="() => setLanguage(Lang.EN)"
          v-bind:class="[
            lang === Lang.EN ? 'selected-lang' : 'lang-button-hover',
            'lang-button'
          ]"
        >
          EN
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";
import { Lang } from "@/store";

export default Vue.extend({
  data() {
    return {
      Lang: Object(Lang)
    };
  },
  computed: mapState(["lang"]),
  methods: {
    setLanguage: function (lang: Lang) {
      this.$store.commit("setLang", lang);
    }
  }
});
</script>

<style scoped>
.lang-selector-wrapper {
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.57);
  padding: 5px;
  font-size: 12px;
  box-shadow: 1px 1px 4px 2px rgba(0, 0, 0, 0.07);
  height: min-content;
  margin: 0px 6px 0px 10px;
}
.lang-button {
  background-color: white;
  border: 2px solid #949494;
  color: #949494;
  cursor: pointer;
  padding: 3px 7px 2px 7px;
  font-weight: 550;
  z-index: 2;
  transition-duration: 0.15s;
  -webkit-transition-duration: 0.15s; /* Safari */
}
.lang-button:focus,
.lang-button:hover {
  color: black;
  outline: none;
  box-shadow: 0pt 0pt 1pt 0pt black;
  border-color: black;
  z-index: 5;
}
.selector-left {
  padding: 3px 8px 2px 7px;
  margin-right: -1px;
  border-radius: 5px 0 0 5px;
}
.selector-right {
  border-radius: 0 5px 5px 0;
}
.selector-middle {
  margin-right: -1px;
}
.selected-lang,
.selected-lang:hover {
  z-index: 3;
  cursor: auto;
  color: white;
  border-color: #3969a1;
  background-color: rgba(0, 60, 136, 0.5);
  box-shadow: none;
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
