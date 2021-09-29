import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { FrontPage } from './components/FrontPage'
import { FacilitiesSearch } from './components/FacilitiesSearch/FacilitiesSearch'
import Navigation from './components/Navigation'
import { NavigationItem, RoutePath } from './models'
import { FacilityPage } from './components/FacilityPage/FacilityPage'
import { isDevOrTestEnv } from './env'
import { handleCheckForMissingTranslations } from './utils'
import { ReleasesSearch } from './components/ReleasesSearch/ReleasesSearch'
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
            <Route path={`/${RoutePath.Facilities}/:facilityId`}>
              <FacilityPage />
            </Route>
            <Route path={`/${RoutePath.Facilities}`}>
              <FacilitiesSearch />
            </Route>
            <Route path={`/${RoutePath.ReleasesToAir}`}>
              <ReleasesSearch medium={Medium.AIR} />
            </Route>
            <Route path={`/${RoutePath.ReleasesToWater}`}>
              <ReleasesSearch medium={Medium.WATER} />
            </Route>
            <Route exact path="/">
              <FrontPage />
            </Route>
          </Switch>
        </Router>
      </QueryClientProvider>
    </div>
  )
}

export default App
