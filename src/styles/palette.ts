import { PaletteOptions } from '@mui/material'

interface CustomPalette {
  purpleBlue: string
  lilac: string
}

export interface IPaletteOptions extends PaletteOptions {
  custom: CustomPalette
}

// Использовать только в теме MUI
export const palette: IPaletteOptions = {
  background: {
    default: '#ffffff',
    paper: '#ffffff',
  },
  primary: {
    main: '#302655',
  },
  secondary: {
    main: '#895070',
  },
  custom: {
    purpleBlue: '#302655',
    lilac: '#895070',
  },
}
