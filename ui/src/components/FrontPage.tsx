import { useTranslation } from 'react-i18next'

export const FrontPage = () => {
  const { t } = useTranslation()
  return <div>{t('common.welcomeMessage')}</div>
}
