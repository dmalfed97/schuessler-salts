import type { TextFieldProps, TextFieldVariants } from '@mui/material'
import { TextField } from '@mui/material'
import type { ReactNode } from 'react'
import type { UseWatchProps, FieldPath, FieldValues, ControllerFieldState } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import MaskedInput from 'react-input-mask'

import { useStyles } from './index.styled'

interface TextFieldWithControllerProps<T extends FieldValues>
  extends Omit<TextFieldProps, 'variant'> {
  name: FieldPath<T>
  hookFormProps: Omit<UseWatchProps<T>, 'name' | 'render' | 'defaultValue'>
  trimWhiteSpaces?: boolean
  variant?: TextFieldVariants
  mask?: string
  maskChar?: string
}

/**
 * TextField с react-hook-form Controller
 * @param name - для react-hook-form Controller
 * @param hookFormProps
 * @param trimWhiteSpaces - флаг для чистки поля при onChange от пробелов
 * @param variant
 * @param rest - наследуются от TextFieldProps
 * @param mask - маска ввода
 * @param maskChar - символ, заполняющий пустые значения в маске
 */
const TextFieldWithController = function <T extends FieldValues>({
  name,
  hookFormProps,
  trimWhiteSpaces,
  variant = 'outlined',
  mask,
  maskChar = ' ',
  ...rest
}: TextFieldWithControllerProps<T>) {
  const { t } = useTranslation()

  const { classes } = useStyles()

  // Handlers
  const getHelperText = (fieldState: ControllerFieldState): ReactNode => {
    if (fieldState.error?.type === 'server') {
      return fieldState.error?.message
    }
    if (fieldState.error?.message) {
      return t(fieldState.error?.message, { defaultValue: t('error.fieldError') })
    }
    return rest.helperText
  }

  // Renders
  if (mask) {
    return (
      <Controller
        name={name}
        render={({ field, fieldState }) => (
          <MaskedInput
            mask={mask}
            maskChar={maskChar}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
          >
            {() => (
              <TextField
                className={classes.textField}
                inputRef={field.ref}
                variant={variant}
                {...field}
                {...rest}
                error={!!fieldState.error?.message || rest.error}
                helperText={getHelperText(fieldState)}
                ref={null}
              />
            )}
          </MaskedInput>
        )}
        {...hookFormProps}
      />
    )
  }
  return (
    <Controller
      name={name}
      render={({ field, fieldState }) => (
        <TextField
          className={classes.textField}
          inputRef={field.ref}
          variant={variant}
          {...field}
          {...rest}
          error={!!fieldState.error?.message || rest.error}
          helperText={getHelperText(fieldState)}
          ref={null}
          onChange={(e) => {
            const { onChange } = rest

            if (onChange) {
              onChange(e)
            } else {
              if (trimWhiteSpaces) {
                field.onChange({
                  ...e,
                  target: {
                    ...e.target,
                    value: e.target.value.trim(),
                  },
                })
              } else {
                field.onChange(e)
              }
            }
          }}
        />
      )}
      {...hookFormProps}
    />
  )
}

export { TextFieldWithController }
