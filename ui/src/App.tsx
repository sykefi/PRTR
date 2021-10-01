import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { FrontPage } from './components/FrontPage'
import { FacilitySearch } from './components/FacilitySearch/FacilitySearch'
import Navigation from './components/Navigation'
import { NavigationItem } from './models/NavigationItem'
import { RoutePath } from './models/RoutePath'
import { FacilityPage } from './components/FacilityPage/FacilityPage'
import { isDevOrTestEnv } from './env'
import { handleCheckForMissingTranslations } from './utils'
import { ReleaseSearch } from './components/ReleaseSearch/ReleaseSearch'
import { Medium } from './api/models/Medium'

const queryClient = new QueryClient()

const navigationItems: NavigationItem[] = [
  { tKey: 'common.frontPage', path: RoutePath.FrontPage },
  { tKey: 'common.facilitySearch', path: RoutePath.Facilities },
  { tKey: 'common.releasesToAir', path: RoutePath.ReleasesToAir },
  { tKey: 'common.releasesToWater', path: RoutePath.ReleasesToWater }
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
      <QueryClientProvider client={queryClient}>
        <Router>
          <Navigation navigationItems={navigationItems} />
          <Switch>
            <Route path={`${RoutePath.Facilities}/:facilityId`}>
              <FacilityPage />
            </Route>
            <Route path={RoutePath.Facilities}>
              <FacilitySearch />
            </Route>
            <Route path={RoutePath.ReleasesToAir}>
              <ReleaseSearch medium={Medium.AIR} />
            </Route>
            <Route path={RoutePath.ReleasesToWater}>
              <ReleaseSearch medium={Medium.WATER} />
            </Route>
            <Route exact path={RoutePath.FrontPage}>
              <FrontPage />
            </Route>
          </Switch>
        </Router>
      </QueryClientProvider>
    </div>
  )
}

export default App
