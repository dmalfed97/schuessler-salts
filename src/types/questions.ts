export type QuestionMapType = {
  answer: boolean | null
  values: {
    [key: string]: number
  }
}

export type BlockMapType = {
  questions: Map<string, QuestionMapType>
}

export type StepMapType = {
  stepTitle: string | null
  blocks: Map<string, BlockMapType>
}

export type QuestionsType = Map<string, StepMapType>

export type SerializedQuestionsType = Record<
  string,
  {
    stepTitle: string | null;
    blocks: Record<
      string,
      {
        questions: Record<
          string,
          {
            answer: boolean | null;
            values: Record<string, number>;
          }
        >;
      }
    >;
  }
>
