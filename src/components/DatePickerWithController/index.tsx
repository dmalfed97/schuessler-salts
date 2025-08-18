import type { ReactNode } from 'react'
import type { FieldPath, FieldValues, UseWatchProps, ControllerFieldState } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { DatePicker, type DatePickerProps } from '@mui/x-date-pickers/DatePicker'
import dayjs, { type Dayjs } from 'dayjs'

import { useStyles } from './index.styled'

interface DatePickerWithControllerProps<T extends FieldValues>
  extends Omit<DatePickerProps, 'value' | 'onChange'> {
  name: FieldPath<T>
  hookFormProps: Omit<UseWatchProps<T>, 'name' | 'render' | 'defaultValue'>
  required?: boolean
}

const formatDate = (date: Dayjs | null) => {
  return date ? date.format('MM.DD.YYYY') : ''
}

const parseDate = (value: string): Dayjs | null => {
  return value ? dayjs(value, 'MM.DD.YYYY', true) : null
}

const DatePickerWithController = function <T extends FieldValues>({
  name,
  hookFormProps,
  required,
  ...rest
}: DatePickerWithControllerProps<T>) {
  const { t } = useTranslation()
  const { classes } = useStyles()

  const getHelperText = (fieldState: ControllerFieldState): ReactNode => {
    if (fieldState.error?.type === 'server') {
      return fieldState.error?.message
    }
    if (fieldState.error?.message) {
      return t(fieldState.error?.message, { defaultValue: t('error.fieldError') })
    }
    return ''
  }

  return (
    <Controller
      name={name}
      render={({ field, fieldState }) => (
        <DatePicker
          className={classes.textField}
          format="MM.DD.YYYY"
          value={parseDate(field.value)}
          onChange={(date) => {
            if (date && date.isValid()) {
              field.onChange(formatDate(date))
            } else if (date === null) {
              field.onChange('')
            }
          }}
          slotProps={{
            textField: {
              size: 'small',
              error: !!fieldState.error?.message,
              helperText: getHelperText(fieldState),
              required,
              InputProps: {
                notched: false,
              },
            },
          }}
          {...rest}
        />
      )}
      {...hookFormProps}
    />
  )
}

export { DatePickerWithController }
