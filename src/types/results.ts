export type ItemInResultsType = {
  name: string
  img: string
  description: string
  long_description: string
  composition: string
  prescription_14: string
  prescription_8: string
  prescription_2: string
  prescription_0: string
  score: number
}

export type CalculationResultsType = {
  group: string
  items: ItemInResultsType[]
}
