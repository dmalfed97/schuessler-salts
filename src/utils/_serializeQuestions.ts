import {QuestionsType, SerializedQuestionsType} from "../types/questions";

export const serializeQuestions = (questions: QuestionsType): string => {
  const serialized: SerializedQuestionsType = {}

  questions.forEach((step, stepKey) => {
    serialized[stepKey] = {
      stepTitle: step.stepTitle,
      blocks: Object.fromEntries(
        Array.from(step.blocks.entries()).map(([blockKey, block]) => [
          blockKey,
          {
            questions: Object.fromEntries(
              Array.from(block.questions.entries()).map(([qKey, question]) => [
                qKey,
                {
                  answer: question.answer,
                  values: question.values,
                },
              ])
            ),
          },
        ])
      ),
    }
  })

  return JSON.stringify(serialized)
}
