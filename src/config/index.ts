import { ILang } from '../providers/I18Next/interfaces'
import { Language } from '../types/language'

export const appConfig = {
  apiUrl: {
    prod: import.meta.env.VITE_APP_API_URL, // this var require on server
  },

  // Auth
  accessTokenStorageKey: '_AccessToken', // _[projectName]AccessToken

  // i18n
  langStorageKey: '_Lang', // _[projectName]Lang
  defaultLanguage: Language.RU,
  languages: [
    { title: 'Русский', lang: Language.RU },
  ] as ILang[],

  // In seconds
  delay: {},
  apiVersions: {
    default: '',
    list: {} as Record<string, string>,
  },

  // Default settings
  defaultItemsCount: 3,

  // Все ссылки тут
  apiEndpoint: 'https://biosalts.ru',
  privacyPolicyUrl: `https://biosalts.ru/politika-v-otnoshenii-obrabotki-personalnyh-dannyh/`,
  personalDataAcceptanceUrl: `https://biosalts.ru/soglasie-posetitelya-sajta-na-obrabotku-personalnyh-dannyh/`,
  xlsxUrl: `https://docs.google.com/spreadsheets/d/1V6u4y2-ctmQ_FdDtL_13nNnEnp6h1Qol/export?format=xlsx`,
  completeAgainUrl: `https://biosalts.ru/catalog/soli-schuesslera/salts1_12/sol-schuesslera-1/`
}
