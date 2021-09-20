import 'react-i18next';
import translation from '../public/locales/fi/translation.json';

// TS magic for translations by ford04: https://stackoverflow.com/a/58308279/15619648
type Concat<K extends string, P extends string> = `${K}${'' extends P
  ? ''
  : '.'}${P}`;

type WithBasePrefix<K extends string, P extends string> = `${K}${':'}${P}`;

type DeepKeys<T> = T extends Record<string, unknown>
  ? {
      [K in keyof T]-?: `${K & string}` | Concat<K & string, DeepKeys<T[K]>>;
    }[keyof T]
  : '';

type DeepLeafKeys<T> = T extends Record<string, unknown>
  ? {
      [K in keyof T]-?: Concat<K & string, DeepKeys<T[K]>>;
    }[keyof T]
  : '';

export type TranslationKeys = DeepLeafKeys<typeof translation>;

// react-i18next versions higher than 11.11.0
declare module 'react-i18next' {
  // and extend them!
  interface CustomTypeOptions {
    // custom namespace type if you changed it
    defaultNS: 'translation';
    // custom resources type
    resources: {
      translation: typeof translation;
    }
  }
}
