export type InitialOrderResponse = {
  status?: boolean
  token?: string
}

export type SubmitFormResponse = {
  status?: boolean
}

// Submit Form Payload
type CustomerInfo = {
  firstname: string
  secondname: string
  lastname: string
  email: string
  phone: string
  dateofbird: string
}

type CheckboxInfo = {
  title: string
  sections: {
    title: string
    checked: string[]
  }[]
}

type ResultInfo = {
  salt: string
  group: string
  img: string
  description: string
  long_description: string
  composition: string
  prescription_14: string,
  prescription_8: string,
  prescription_2: string,
  prescription_0: string,
}

export type SubmitFormPayload = {
  customer: CustomerInfo
  checkboxes: CheckboxInfo[]
  rezults: ResultInfo[]
}
