import {memo, MouseEvent, useMemo, useEffect, useState} from 'react'
import {Button, Card, CardContent, CardMedia, Stack, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";

import {appConfig} from '../../../config'
import {MainPageSteps} from "../steps";
import {QuestionsType} from "../../../types/questions";
import {CalculationResultsType} from "../../../types/results";
import {ItemsMap} from "../../../types/items";
import {GroupType} from "../../../types/group";
import {PersonalInfoFormType} from "../InfoStep/validation";

interface ResultsStepProps {
  initData: {
    // eslint-ignore-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
  }
  questions: QuestionsType
  groups: GroupType[]
  itemsList: ItemsMap
  personalInfo: PersonalInfoFormType
  refresh(): void
  setStep(newStep: MainPageSteps): void
}

const ResultsStep = memo(({
  setStep, questions, itemsList, refresh, groups, initData, personalInfo,
}: ResultsStepProps) => {
  const { t } = useTranslation()

  const [resultsAreReady, setResultsAreReady] = useState<boolean>(false)

  // Helpers
  const results = useMemo((): CalculationResultsType[] => {
    const itemsResultList = [...itemsList].map(([itemName, itemData]) => ({
      name: itemName,
      img: itemData.img ? String(itemData.img) : null,
      description: itemData.description ? String(itemData.description) : null,
      group: String(itemData.group),
      score: 0,
    }))

    itemsResultList.forEach((resultItem) => {
      questions.forEach((step) => {
        step.blocks.forEach((block) => {
          block.questions.forEach((question) => {
            if (question.answer) {
              Object.keys(question.values).forEach((key) => {
                if (key === resultItem.name) {
                  resultItem.score += question.values[key]
                }
              })
            }
          })
        })
      })
    })

    const result: CalculationResultsType[] = []

    // В итоговый список попадут только те соли, которые имеют ненулевую оценку
    itemsResultList.forEach((item) => {
      if (item.score) {
        const overlap = result.findIndex(({ group }) => group === item.group)

        if (overlap !== -1) {
          result[overlap].items.push({ ...item })
        } else {
          result.push({
            group: item.group,
            items: [{ ...item }],
          })
        }
      }
    })

    setResultsAreReady(true)

    return result
  }, [questions, itemsList])

  // Effects
  useEffect(() => {
    if (resultsAreReady && results.length && personalInfo.email) {
      const message = {
        type: 'QUESTIONNAIRE_COMPLETE',
        content: {
          paymentId: initData.paymentId || '',
          form: { ...personalInfo },
          results: results.map((resultsGroup) => ({
            ...resultsGroup,
            items: resultsGroup.items
              .sort((a, b) => (a.score > b.score) ? -1 : 1)
              .slice(0, groups.find((group) => group.name === resultsGroup.group)?.count || appConfig.defaultItemsCount)
          })) as CalculationResultsType[],
        },
      }

      window.parent.postMessage(message, '*')
    }
  }, [resultsAreReady, results, initData, personalInfo, groups])

  // Handlers
  const refreshScoreBoard = (e: MouseEvent): void => {
    e.stopPropagation()

    const message = {
      type: 'NEW_QUESTIONNAIRE',
      content: {
        paymentId: initData.paymentId || '',
      },
    }
    window.parent.postMessage(message, '*')

    refresh()

    setStep(MainPageSteps.INFO)
  }

  // Renders
  return (
    <Stack alignItems="stretch" gap={2}>
      <Typography variant="h6">
        {t('screens.main.results')}
      </Typography>

      <Stack gap={2.5}>
        {results.map((resultsGroup) => (
          <Stack
            key={resultsGroup.group}
            borderBottom="1px solid lightgray"
            paddingBottom={2}
            gap={1}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              {t('word.group')}: {resultsGroup.group}
            </Typography>

            <Stack
              direction="row"
              gap={2}
              justifyContent="space-between"
            >
              {resultsGroup.items
                .sort((a, b) => (a.score > b.score) ? -1 : 1)
                .slice(0, groups.find((group) => group.name === resultsGroup.group)?.count || appConfig.defaultItemsCount)
                .map((item) => (
                  <Card key={item.name}>
                    <CardMedia image={item.img || '/public/vite.svg'} sx={{ height: 150 }} />

                    <CardContent>
                      <Typography variant="h6">{item.name}</Typography>

                      <Typography variant="body2">{item.description || ''}</Typography>

                      <Typography variant="body2">Score: {item.score}</Typography>
                    </CardContent>
                  </Card>
                )
              )}
            </Stack>
          </Stack>
        ))}
      </Stack>

      <Stack direction="row" justifyContent="flex-end">
        <Button variant="contained" onClick={refreshScoreBoard}>
          {t('button.calculateAgain')}
        </Button>
      </Stack>
    </Stack>
  )
})

export { ResultsStep }
