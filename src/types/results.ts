export type ItemInResultsType = {
  name: string
  img: string | null
  description: string | null
  score: number
}

export type CalculationResultsType = {
  group: string
  items: ItemInResultsType[]
}
