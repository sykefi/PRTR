import { TranslationKeys } from './react-i18next'

export enum RoutePath {
  FrontPage = '',
  Facilities = 'facilities',
  Releases = 'releases',
  ReleasesToAir = 'releases/toAir',
  ReleasesToWater = 'releases/toWater'
}

export interface NavigationItem {
  tKey: TranslationKeys
  path: RoutePath
}
