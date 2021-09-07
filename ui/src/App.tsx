import { useTranslation } from 'react-i18next'

const App = () => {
  const { t } = useTranslation()

  return <div>{t('common.tempKey')}</div>
}

export default App
