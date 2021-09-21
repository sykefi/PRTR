import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Flex } from '@chakra-ui/layout'
import { FrontPage } from './components/FrontPage'
import { FacilityPage } from './components/FacilityPage/FacilityPage'
import { Releases } from './components/Releases'
import Navigation from './components/Navigation'
import { NavigationItem, RoutePath } from './models'
import { FacilityInfo } from './components/FacilityPage/FacilityInfo'
import { isDevOrTestEnv } from './env'
import { checkForMissingTranslations } from './utils'
import { FacilityMainActivityCode } from './models/FacilityMainActivityCode'

const navigationItems: NavigationItem[] = [
  { tKey: 'common.frontPage', path: RoutePath.FrontPage },
  { tKey: 'common.facilities', path: RoutePath.Facilities },
  { tKey: 'common.pollutantReleases', path: RoutePath.Releases }
]

const App = () => {
  const { ready } = useTranslation(['translation', 'mainActivityCodeDesc'])

  useEffect(() => {
    // check for missing translations
    if (ready && isDevOrTestEnv) {
      checkForMissingTranslations(
        'mainActivityCodeDesc',
        Object.values(FacilityMainActivityCode)
      )
    }
  }, [ready])

  return (
    <div data-cy="app-container">
      <Router>
        <Navigation navigationItems={navigationItems} />
        <Flex p={4} width="100%" flexWrap="wrap" justify="center">
          <Switch>
            <Route path={`/${RoutePath.Facilities}/:facilityId`}>
              <FacilityInfo />
            </Route>
            <Route path={`/${RoutePath.Facilities}`}>
              <FacilityPage />
            </Route>
            <Route path={`/${RoutePath.Releases}`}>
              <Releases />
            </Route>
            <Route exact path="/">
              <FrontPage />
            </Route>
          </Switch>
        </Flex>
      </Router>
    </div>
  )
}

export default App
