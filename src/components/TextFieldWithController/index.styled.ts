import { makeStyles } from 'tss-react/mui'

export const useStyles: any = makeStyles()(() => ({
  textField: {
    '& .MuiTextField-root': {
      width: '100%',
      color: 'black',
    },
    '& .MuiInputBase-root': {
      borderRadius: 8,
      background: '#FFF',
    },
    '& .MuiIconButton-root': {
      marginRight: -5,
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#E0E0E0',
    },
    '& .MuiSvgIcon-root': {
      color: '#E0E0E0',
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#1FAE4C !important',
    },
    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#1FAE4C !important',
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#1FAE4C',
    },
  },
}))
