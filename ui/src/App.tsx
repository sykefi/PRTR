import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { FrontPage } from './components/FrontPage'
import { FacilitiesPage } from './components/FacilitiesPage/FacilitiesPage'
import { ReleasesMainPage } from './components/ReleasesPage/ReleasesMainPage'
import Navigation from './components/Navigation'
import { NavigationItem, RoutePath } from './models'
import { FacilityPage } from './components/FacilityPage/FacilityPage'
import { isDevOrTestEnv } from './env'
import { handleCheckForMissingTranslations } from './utils'

const navigationItems: NavigationItem[] = [
  { tKey: 'common.frontPage', path: RoutePath.FrontPage },
  { tKey: 'common.facilities', path: RoutePath.Facilities },
  { tKey: 'common.pollutantReleases', path: RoutePath.Releases }
]

const App = () => {
  const { ready } = useTranslation(['translation', 'mainActivityCodeDesc'])

  useEffect(() => {
    if (ready && isDevOrTestEnv) {
      handleCheckForMissingTranslations()
    }
  }, [ready])

  return (
    <div data-cy="app-container">
      <Router>
        <Navigation navigationItems={navigationItems} />
        <Switch>
          <Route path={`/${RoutePath.Facilities}/:facilityId`}>
            <FacilityPage />
          </Route>
          <Route path={`/${RoutePath.Facilities}`}>
            <FacilitiesPage />
          </Route>
          <Route path={`/${RoutePath.Releases}`}>
            <ReleasesMainPage />
          </Route>
          <Route exact path="/">
            <FrontPage />
          </Route>
        </Switch>
      </Router>
    </div>
  )
}

export default App
