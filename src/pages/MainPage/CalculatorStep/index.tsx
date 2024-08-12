import {memo, MouseEvent, useEffect, useState, useCallback} from 'react'
import {useTranslation} from "react-i18next";
import {Button, Stack} from "@mui/material";

import {MainPageSteps} from "../steps";
import {QuestionsType, StepMapType} from "../../../types/questions";
import {QuestionsStep} from "./QuestionsStep";
import {StepsSideList} from "./StepsSideList";
import {useMuiMediaQuery} from "../../../hooks/useMuiMediaQuesry";

interface CalculatorStepProps {
  questions: QuestionsType
  stepsList: string[]
  step: MainPageSteps
  setStep(newStep: MainPageSteps): void
  setQuestions(questions: QuestionsType): void
}

// Система пишется в расчете на то, что все вопросы - бинарные
const CalculatorStep = memo(({
  step, setStep, questions, stepsList, setQuestions,
}: CalculatorStepProps) => {
  const { t } = useTranslation()

  const { isMD } = useMuiMediaQuery()

  const [activeBlockIndex, setActiveBlockIndex] = useState<string>(stepsList[0])
  const [activeBlock, setActiveBlock] = useState<StepMapType | undefined>(questions.get(activeBlockIndex))

  // Effects
  useEffect(() => {
    setActiveBlock(questions.get(activeBlockIndex))
  }, [activeBlockIndex, questions])

  // Handlers
  const toPreviousQuestion = (e: MouseEvent) => {
    e.stopPropagation()

    if (activeBlock) {
      setQuestions(questions.set(activeBlockIndex, activeBlock))
    }

    const stepsListIndex = stepsList.findIndex((block) => block === activeBlockIndex)

    if (stepsListIndex !== -1) {
      if (stepsListIndex > 0) {
        setActiveBlockIndex(stepsList[stepsListIndex - 1])
      } else {
        setStep(MainPageSteps.INFO)
      }
    }
  }

  const toNextQuestion = (e: MouseEvent) => {
    e.stopPropagation()

    if (activeBlock) {
      setQuestions(questions.set(activeBlockIndex, activeBlock))
    }

    const stepsListIndex = stepsList.findIndex((block) => block === activeBlockIndex)

    if (stepsListIndex !== -1) {
      if (stepsListIndex < stepsList.length - 1) {
        setActiveBlockIndex(stepsList[stepsListIndex + 1])
      } else {
        setStep(MainPageSteps.RESULTS)
      }
    }
  }

  const changeActiveBlockIndex = useCallback((step: string) => {
    if (activeBlock) {
      setQuestions(questions.set(activeBlockIndex, activeBlock))
    }

    setActiveBlockIndex(step)
  }, [activeBlock, activeBlockIndex, questions, setQuestions])

  // Renders
  return (
    <Stack gap={3}>
      <Stack gap={2} direction="row" alignItems="flex-start">
        {isMD && (
          <StepsSideList
            step={step}
            setStep={setStep}
            stepsList={stepsList}
            activeBlockIndex={activeBlockIndex}
            setActiveBlockIndex={changeActiveBlockIndex}
          />
        )}

        <Stack gap={2} flexGrow={1}>
          {activeBlock && (
            <QuestionsStep
              activeBlock={activeBlock}
              setActiveBlock={setActiveBlock}
            />
          )}
        </Stack>
      </Stack>

      <Stack direction="row" justifyContent="space-between">
        <Button variant="contained" onClick={toPreviousQuestion}>
          {t('button.previous')}
        </Button>

        <Button variant="contained" onClick={toNextQuestion}>
          {t('button.next')}
        </Button>
      </Stack>
    </Stack>
  )
})

export { CalculatorStep }
