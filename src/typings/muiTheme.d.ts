import { Theme } from '@mui/material/styles'

import { IPaletteOptions } from '~app/styles/palette'

declare module '@mui/material/styles' {
  interface Palette {
    custom: IPaletteOptions['custom']
  }
  interface PaletteOptions {
    custom: IPaletteOptions['custom']
  }
}

declare module '@emotion/styles' {
  type DefaultTheme = Theme
}
