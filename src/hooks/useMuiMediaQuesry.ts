import { useMediaQuery, useTheme } from '@mui/material'

export const useMuiMediaQuery = () => {
  const theme = useTheme()

  return {
    isXS: useMediaQuery(theme.breakpoints.up('xs')),
    isSM: useMediaQuery(theme.breakpoints.up('sm')),
    isMD: useMediaQuery(theme.breakpoints.up('md')),
    isLG: useMediaQuery(theme.breakpoints.up('lg')),
    isXL: useMediaQuery(theme.breakpoints.up('xl')),
  }
}
