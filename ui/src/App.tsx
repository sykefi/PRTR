import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, Box } from '@chakra-ui/layout'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { FrontPage } from './components/FrontPage/FrontPage'
import { FacilitySearch } from './components/FacilitySearch/FacilitySearch'
import Navigation from './components/Navigation/Navigation'
import { NavigationItem } from './models/NavigationItem'
import { RoutePath } from './models/RoutePath'
import { FacilityPage } from './components/FacilityPage/FacilityPage'
import { isDevOrTestEnv } from './env'
import { handleCheckForMissingTranslations } from './utils'
import { ReleaseSearch } from './components/ReleaseSearch/ReleaseSearch'
import { Medium } from './api/models/Medium'
import { ScrollToTop } from './components/ScrollToTop'
import { Footer } from './components/Footer'
import { WasteTransferSearch } from './components/WasteTransferSearch/WasteTransferSearch'

const queryClient = new QueryClient()

const navigationItems: NavigationItem[] = [
  { tKey: 'common.facilitySearch', path: RoutePath.Facilities },
  { tKey: 'common.releasesToAir', path: RoutePath.ReleasesToAir },
  { tKey: 'common.releasesToWater', path: RoutePath.ReleasesToWater },
  { tKey: 'common.wasteTransfers', path: RoutePath.WasteTransfers }
]

const App = () => {
  const { ready } = useTranslation(['translation', 'mainActivityCodeDesc'])

  useEffect(() => {
    if (ready && isDevOrTestEnv) {
      handleCheckForMissingTranslations()
    }
  }, [ready])

  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <Flex data-cy="app-container" direction="column" minHeight="100%">
          <Navigation navigationItems={navigationItems} />
          <Box flex="1">
            <ScrollToTop />
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
              <Route path={RoutePath.WasteTransfers}>
                <WasteTransferSearch />
              </Route>
              <Route exact path={RoutePath.FrontPage}>
                <FrontPage />
              </Route>
            </Switch>
          </Box>
          <Footer />
        </Flex>
      </QueryClientProvider>
    </Router>
  )
}

export default App
