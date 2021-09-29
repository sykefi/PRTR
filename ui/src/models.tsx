import { TranslationKeys } from './react-i18next'

export enum RoutePath {
  FrontPage = '/',
  Facilities = '/facilities',
  ReleasesToAir = '/releases/toAir',
  ReleasesToWater = '/releases/toWater'
}

export interface NavigationItem {
  tKey: TranslationKeys
  path: RoutePath
}
