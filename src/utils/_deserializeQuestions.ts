import {BlockMapType, QuestionMapType, QuestionsType, SerializedQuestionsType, StepMapType} from "../types/questions";

export const deserializeQuestions = (obj: SerializedQuestionsType): QuestionsType => {
  return new Map(
    Object.entries(obj).map(([stepKey, stepValue]) => [
      stepKey,
      {
        stepTitle: stepValue.stepTitle,
        blocks: new Map(
          Object.entries(stepValue.blocks).map(([blockKey, blockValue]) => [
            blockKey,
            {
              questions: new Map(
                Object.entries(blockValue.questions).map(([qKey, qValue]) => [
                  qKey,
                  {
                    answer: qValue.answer,
                    values: qValue.values,
                  } as QuestionMapType,
                ])
              ),
            } as BlockMapType,
          ])
        ),
      } as StepMapType,
    ])
  );
}
