import { createTheme } from '@mui/material'

import { palette } from './palette'

export const theme = createTheme({
  breakpoints: {
    values: {
      xs: 320,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1208 + 48,
    },
  },
  palette,
  typography: {
    fontFamily: 'Inter-Regular, sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          minWidth: 320,
        },
        main: {
          flex: '1 0 auto',
        },
        '#root': {
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        },
        img: {
          height: 'auto',
          maxWidth: '100%',
        },
        '.router-link': {
          textDecoration: 'none',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        size: 'large',
        disableElevation: true,
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 5,
        },
        text: {
          transition: 'all .3s ease',
          '&:hover': {
            color: '',
          },
        },
        contained: ({ theme }) => ({
          transition: 'none',
          // eslint-disable-next-line max-len
          background: `linear-gradient(90deg, ${theme.palette.custom.purpleBlue} 0%, ${theme.palette.custom.lilac} 100%)`,
          color: 'white',
          '&:hover': {
            background: `${theme.palette.custom.purpleBlue}`,
          },
          '&:disabled': {
            opacity: '70%',
            color: 'white',
          },
        }),
        outlined: ({ theme }) => ({
          border: `1px solid ${theme.palette.custom.lilac}`,
          color: theme.palette.custom.lilac,
          fontWeight: 600,
          '&:hover': {
            background: 'rgba(137, 80, 112, 0.5)',
            border: `1px solid rgba(137, 80, 112, 0.5)`,
            color: 'white',
          },
          '&:disabled': {
            opacity: '40%',
            border: `1px solid ${theme.palette.custom.lilac}`,
            color: theme.palette.custom.lilac,
          },
        }),
      },
    },
    MuiButtonGroup: {
      styleOverrides: {
        root: ({ theme }) => ({
          '.MuiButtonGroup-grouped:not(:last-of-type)': {
            borderColor: theme.palette.custom.lilac,
          },
        }),
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          '.MuiFormLabel-asterisk': {
            color: 'red!important',
          },
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: ({ theme }) => ({
          [theme.breakpoints.up('lg')]: {
            maxWidth: 1192,
          },
        }),
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
      },
    },
    MuiModal: {
      styleOverrides: {
        root: {
          background: '#dbd7e4a1',
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        root: {
          background: 'transparent',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '4px 3px 40px -2px rgba(34, 60, 80, 0.1)',
          borderRadius: 10,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: 'white',
          color: 'black',
          boxShadow: '4px 3px 40px -2px rgba(34, 60, 80, 0.1)',
          padding: 10,
          fontSize: 13,
          borderRadius: 10,
        },
        arrow: {
          '&::before': {
            boxShadow: '4px 3px 40px -2px rgba(34, 60, 80, 0.1)',
            backgroundColor: 'white',
          },
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          opacity: '0.5!important',
        },
      },
    },
    MuiInputBase: {
      defaultProps: {
        size: 'small',
      },
      styleOverrides: {
        root: {
          backgroundColor: 'white',
        },
        formControl: {
          'label + &': {
            marginTop: 25,
          },
        },
      },
    },
    MuiOutlinedInput: {
      defaultProps: {
        notched: false,
      },
    },
    MuiInputLabel: {
      defaultProps: {
        shrink: true,
      },
      styleOverrides: {
        root: {
          transform: 'translate(0, 1.5px) scale(0.9)',
          fontWeight: 600,
          color: 'black',
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          borderRadius: 30 / 2,
          width: 55,
          height: 30,
          padding: 0,
        },
        track: {
          width: 55,
          height: 30,
        },
        switchBase: {
          padding: 0,
          margin: 2,
          width: 26,
          height: 26,
          '&.Mui-checked': {
            transform: 'translateX(24px)',
          },
        },
        thumb: {
          width: 26,
          height: 26,
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          margin: '2px 0',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        root: {
          background: 'unset',
        },
        list: {
          padding: 0,
        },
      },
    },
  },
})
