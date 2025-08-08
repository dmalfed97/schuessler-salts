import { makeStyles } from 'tss-react/mui'

export const useStyles: any = makeStyles()(() => ({
  textField: {
    '& .MuiTextField-root': {
      width: '100%',
      color: 'black',
    },
    '& .MuiPickersInputBase-root': {
      marginTop: 25,
      borderRadius: 8,
      background: '#FFF',
    },
    '& .MuiPickersInputBase-root.Mui-focused .MuiPickersOutlinedInput-notchedOutline': {
      borderColor: '#1FAE4C !important',
    },
    '& .MuiPickersInputBase-root:hover .MuiPickersOutlinedInput-notchedOutline': {
      borderColor: '#1FAE4C !important',
    },
    '& .MuiInputLabel-root': {
      transform: 'translate(0, 1.5px) scale(0.9)',
      fontWeight: 600,
      color: 'black',
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#1FAE4C',
    },
    '& .MuiPickersOutlinedInput-notchedOutline > legend': {
      maxWidth: '0 !important',
    },
  },
}))
