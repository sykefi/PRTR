import Vue from "vue";
import App from "./App.vue";
import { store } from "./store";
import "./utils/translate/translate.filter";

Vue.config.productionTip = false;

new Vue({
  store,
  render: (h) => h(App)
}).$mount("#paastokartta-div");
