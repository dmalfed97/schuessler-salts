import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import { ru } from '../../../public/locales/ru/translation'
import { Language } from '../../types/language'
import { appConfig } from '../../config'

export const resources = {
  [Language.RU]: ru,
}

void i18n.use(initReactI18next).init({
  debug: import.meta.env.DEV,
  defaultNS: 'common',
  resources,
  lng: localStorage.getItem(appConfig.langStorageKey) || undefined,
  fallbackLng: appConfig.defaultLanguage,
  load: 'languageOnly',
  interpolation: {
    escapeValue: false,
  },
})

export { i18n }
