import * as Yup from 'yup'
import dayjs from 'dayjs'

const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;
const phoneRegExp = /^\+7\s*\(?(\d{3})\)?\s*(\d{3})[\s-]?(\d{2})[\s-]?(\d{2})$/

export const PersonalInfoValidationSchema = Yup.object({
  firstName: Yup.string().required('error.requiredField'),
  secondName: Yup.string(),
  lastName: Yup.string().required('error.requiredField'),
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
        const date = dayjs(value, 'MM.DD.YYYY', true); // strict = true
        return date.isValid();
      }
      return false;
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
