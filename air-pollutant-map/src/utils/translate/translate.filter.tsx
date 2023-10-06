import Vue from "vue";
import translateService from "./translate.service";

const translateKey = (key: string): string => {
  if (!key) return "";
  return translateService.translate(key);
};

Vue.filter("translate", translateKey);

export default translateKey;
