import * as Yup from 'yup'

export const PersonalInfoValidationSchema = Yup.object({
  firstName: Yup.string().required(),
  secondName: Yup.string(),
  lastName: Yup.string(),
  email: Yup.string().email().required(),
  phone: Yup.string().required(),
  dateOfBirth: Yup.string(),
})

export type PersonalInfoFormType = {
  firstName: string
  secondName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
}
