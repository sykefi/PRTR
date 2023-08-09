import Vue from "vue";
import Vuex from "vuex";
import Cookies from "js-cookie";

Vue.use(Vuex);

export enum Lang {
  FI = "fi",
  SV = "sv",
  EN = "en"
}

export enum Dispatch {
  loadSetInitialLang = "loadSetInitialLang",
  setLang = "setLang",
  setLoading = "setLoading",
  setLoaded = "setLoaded"
}

enum Mutation {
  setLang = "setLang",
  setLoadingState = "setLoadingState"
}

const state = {
  lang: Lang.FI as Lang,
  loading: true as boolean
};

const mutations = {
  setLang(state, lang: Lang) {
    Cookies.set("air-pollutant-map-lang", lang);
    state.lang = lang;
  },
  setLoadingState(state, loading: boolean) {
    state.loading = loading;
  }
};

const actions = {
  setLang(context, lang: Lang) {
    context.commit(Mutation.setLang, lang);
  },
  loadSetInitialLang(context) {
    // try to load initial language from URL search parameters
    const params = new URLSearchParams(window.location.search);
    if (params.has("lang")) {
      const langParam = params.get("lang") as Lang;
      if (langParam && Object.values(Lang).includes(langParam)) {
        context.commit(Mutation.setLang, langParam);
      }
    } else {
      // try to load previously selected language from Cookies
      const previouslySelectedLang = Cookies.get("air-pollutant-map-lang") as Lang;
      if (previouslySelectedLang) {
        context.commit(Mutation.setLang, previouslySelectedLang);
      }
    }
  },
  setLoading(context) {
    context.commit(Mutation.setLoadingState, true);
  },
  setLoaded(context) {
    context.commit(Mutation.setLoadingState, false);
  }
};

export const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters: {
    lang: (state) => state.lang
  }
});
