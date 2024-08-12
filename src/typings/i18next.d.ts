import { resources } from '~app/providers/I18Next/i18n'
import { Language } from '~shared/@types/language'

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: (typeof resources)[Language.RU]
  }
}
