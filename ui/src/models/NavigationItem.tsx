import { TranslationKeys } from '../react-i18next'
import { RoutePath } from './RoutePath'

export interface NavigationItem {
  tKey: TranslationKeys
  path: RoutePath
}
