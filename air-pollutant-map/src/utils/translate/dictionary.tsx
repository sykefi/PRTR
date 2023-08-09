import fi from "./fi.json";
import sv from "./sv.json";
import en from "./en.json";
import { Lang } from "@/store";
import { NodeEnv } from "@/types";

const dict = {
  fi: fi as Record<string, string>,
  sv: sv as Record<string, string>,
  en: en as Record<string, string>
} as Record<Lang, Record<string, string>>;

if (process.env.NODE_ENV !== NodeEnv.PRODUCTION) {
  Object.values(Lang).forEach((checkLang) => {
    Object.keys(dict[checkLang]).forEach((key) => {
      Object.values(Lang).forEach((checkDict) => {
        if (checkDict !== checkLang) {
          if (!(key in dict[checkDict])) {
            console.error(`missing key from ${checkDict} dict: ${key}`);
          }
        }
      });
    });
  });
}

export default dict;
