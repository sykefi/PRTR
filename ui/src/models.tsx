import { TranslationKeys } from './react-i18next'

export enum RoutePath {
  FrontPage = '',
  Facilities = 'facilities',
  Releases = 'releases'
}

export interface NavigationItem {
  tKey: TranslationKeys
  path: RoutePath
}
