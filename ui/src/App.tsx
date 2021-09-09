import { useTranslation } from 'react-i18next'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import { Home } from './components/Home'
import { Facilities } from './components/Facilities'
import { Releases } from './components/Releases'

const App = () => {
  const { t } = useTranslation()

  return (
    <div data-cy="app-container">
      <Router>
        <div>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/facilities">{t('common.facilities')}</Link>
            </li>
            <li>
              <Link to="/releases">{t('common.pollutantReleases')}</Link>
            </li>
          </ul>

          <Switch>
            <Route path="/facilities">
              <Facilities />
            </Route>
            <Route path="/releases">
              <Releases />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  )
}

export default App
