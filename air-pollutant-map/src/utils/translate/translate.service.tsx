import { store, Lang } from "../../store";
import dictionary from "./dictionary";

export default {
  translate(key: string): string {
    const currentLang: Lang = store.getters.lang;
    if (key in dictionary[currentLang]) {
      return dictionary[currentLang][key];
    }
    if (process.env.NODE_ENV !== "production") {
      console.error(`Could not translate missing key ${key} to ${currentLang}`);
    }

    return key;
  }
};
