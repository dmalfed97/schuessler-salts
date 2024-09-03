export type ItemInResultsType = {
  name: string
  img: string | null
  description: string | null
  long_description: string | null
  composition: string | null
  prescription_14: string | null
  prescription_8: string | null
  prescription_2: string | null
  prescription_0: string | null
  score: number
}

export type CalculationResultsType = {
  group: string
  items: ItemInResultsType[]
}
