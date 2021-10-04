import 'react-i18next';
import translation from '../public/locales/fi/translation.json';
import mainActivityCodeDesc from '../public/locales/fi/mainActivityCodeDesc.json';
import pollutantName from '../public/locales/fi/pollutantName.json';
import pollutantAbbreviation from '../public/locales/fi/pollutantAbbreviation.json';
import pollutantCasNumber from '../public/locales/fi/pollutantCasNumber.json';

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

type DeepLeafKeys<P extends string, T> = T extends Record<string, unknown>
  ? {
      [K in keyof T]-?: 
      WithBasePrefix<
        P, Concat<K & string, DeepKeys<T[K]>>
      > | 
      Concat<K & string, DeepKeys<T[K]>>;
    }[keyof T]
  : '';

export type TranslationKeys = 
  DeepLeafKeys<'translation', typeof translation> |
  DeepLeafKeys<'mainActivityCodeDesc', typeof mainActivityCodeDesc> |
  DeepLeafKeys<'pollutantName', typeof pollutantName> |
  DeepLeafKeys<'pollutantAbbreviation', typeof pollutantAbbreviation> |
  DeepLeafKeys<'pollutantCasNumber', typeof pollutantCasNumber>

// react-i18next versions higher than 11.11.0
declare module 'react-i18next' {
  // and extend them!
  interface CustomTypeOptions {
    ns: [
      'translation',
      'mainActivityCodeDesc',
      'pollutantName',
      'pollutantAbbreviation',
      'pollutantCasNumber'
    ],
    // custom namespace type if you changed it
    defaultNS: 'translation';
    // custom resources type
    resources: {
      translation: typeof translation;
      mainActivityCodeDesc: typeof mainActivityCodeDesc;
      pollutantName: typeof pollutantName;
      pollutantAbbreviation: typeof pollutantAbbreviation;
      pollutantCasNumber: typeof pollutantCasNumber;
    }
  }
}
