import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { FrontPage } from './components/FrontPage'
import { FacilityList } from './components/FacilityList'
import { Releases } from './components/Releases'
import Navigation from './components/Navigation'
import { NavigationItem, RoutePath } from './models'
import { Box } from '@chakra-ui/layout'
import { FacilityInfo } from './components/FacilityInfo'

const navigationItems: NavigationItem[] = [
  { tKey: 'common.frontPage', path: RoutePath.FrontPage },
  { tKey: 'common.facilities', path: RoutePath.Facilities },
  { tKey: 'common.pollutantReleases', path: RoutePath.Releases }
]

const App = () => {
  return (
    <div data-cy="app-container">
      <Router>
        <Navigation navigationItems={navigationItems} />
        <Box p={4}>
          <Switch>
            <Route path={`/${RoutePath.Facilities}/:facilityId`}>
              <FacilityInfo />
            </Route>
            <Route path={`/${RoutePath.Facilities}`}>
              <FacilityList />
            </Route>
            <Route path={`/${RoutePath.Releases}`}>
              <Releases />
            </Route>
            <Route exact path="/">
              <FrontPage />
            </Route>
          </Switch>
        </Box>
      </Router>
    </div>
  )
}

export default App
