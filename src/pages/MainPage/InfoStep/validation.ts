import * as Yup from 'yup'

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const phoneRegExp = /^\+7\s*\(?(\d{3})\)?\s*(\d{3})[\s-]?(\d{2})[\s-]?(\d{2})$/

export const PersonalInfoValidationSchema = Yup.object({
  firstName: Yup.string().required('error.requiredField'),
  secondName: Yup.string(),
  lastName: Yup.string(),
  email: Yup.string().required('error.requiredField').email('error.emailFormat'),
  phone: Yup.string()
    .test('is-valid-date', 'error.phoneFormat', (value) => {
      if (!value) return true;

      return phoneRegExp.test(value)
    }),
  dateOfBirth: Yup.string().required('error.requiredField')
    .test('is-valid-date', 'error.incorrectDate', (value) => {
      if (!value) return true;

      if (dateRegex.test(value)) {
        const date = new Date(value);
        return !isNaN(date.getTime()) && date.toISOString().startsWith(value);
      } else {
        return false
      }
    }),
})

export type PersonalInfoFormType = {
  firstName: string
  secondName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
}
