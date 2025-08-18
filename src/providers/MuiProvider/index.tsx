import 'dayjs/locale/ru'
import type { PropsWithChildren, ReactElement } from 'react'
import { createTheme, ThemeProvider } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { ruRU as ruRULocaleText } from '@mui/x-date-pickers/locales'
import { ruRU as ruRUMuiLocale } from '@mui/material/locale'

import { theme as baseTheme } from '../../styles/muiTheme'

const MuiProvider = ({ children }: PropsWithChildren): ReactElement => {
  const theme = createTheme({ ...baseTheme }, ruRUMuiLocale, ruRULocaleText)

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider
        dateAdapter={AdapterDayjs}
        adapterLocale="ru"
        localeText={ruRULocaleText.components.MuiLocalizationProvider.defaultProps.localeText}
      >
        {children}
      </LocalizationProvider>
    </ThemeProvider>
  )
}

export { MuiProvider }
