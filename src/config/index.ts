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
}
