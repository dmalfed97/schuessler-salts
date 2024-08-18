import {useEffect, useState, useCallback} from 'react'
import {useTranslation} from "react-i18next";
import {Stack, Typography} from "@mui/material";
import {read, utils} from 'xlsx'

import {MainPageSteps} from "./steps";
import {CalculatorStep} from "./CalculatorStep";
import {ResultsStep} from "./ResultsStep";
import {BlockMapType, QuestionsType} from "../../types/questions";
import {SheetToJSONType} from "../../types/xlsx";
import {ItemsMap, ItemType} from "../../types/items";
import {InfoStep} from "./InfoStep";
import {PersonalInfoFormType} from "./InfoStep/validation";
import {GroupType} from "../../types/group";

const initialPersonalInfoFormData = () => ({
  firstName: '',
  secondName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
})

interface MainPageProps {
  initData: {
    // eslint-ignore-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
  }
}

const MainPage = ({ initData }: MainPageProps) => {
  const { t, i18n: { language } } = useTranslation()

  const [xlsxUrl, setXlsxUrl] = useState<string | null>(null)
  const [step, setStep] = useState<MainPageSteps>(MainPageSteps.INFO)
  const [questions, setQuestions] = useState<QuestionsType>(new Map())
  const [itemsList, setItemsList] = useState<ItemsMap>(new Map())
  const [stepsList, setStepsList] = useState<string[]>([])
  const [groupsList, setGroupsList] = useState<GroupType[]>([])
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoFormType>(initialPersonalInfoFormData())

  // Loader
  const getInitialData = useCallback(async (url: string) => {
    const fetchData = async () => {
      // const response = await fetch(`/locales/${language}/symptoms_data.xlsx`)
      const response = await fetch(url)

      const arrayBuffer = await response.arrayBuffer()

      return read(arrayBuffer, { type: 'array' })
    }

    fetchData()
      .then((workbook) => {
        // Items Map
        const itemsSheet = workbook.Sheets['products']

        if (!itemsSheet) {
          throw new Error('No products found in list')
        }

        const itemsData = utils.sheet_to_json<SheetToJSONType>(itemsSheet, { header: 'A' })

        if (!Object.keys(itemsData[0]).length) {
          throw new Error('Products list is empty')
        } else {
          const itemsMap = new Map<string, ItemType>()

          const [namesArr, ...restArr] = itemsData

          for (const key in namesArr) {
            if (namesArr[key]) {
              const obj: ItemType = restArr.reduce((acc: ItemType, item) => {
                if (item['A']) {
                  acc[item['A']] = item[key] || null
                }

                return acc
              }, {})

              itemsMap.set(String(namesArr[key]), obj)
            }
          }

          setItemsList(itemsMap)
        }

        // Список групп товаров
        const groupsSheet = workbook.Sheets['groups']

        if (groupsSheet) {
          const groupsData = utils.sheet_to_json<SheetToJSONType>(groupsSheet, { header: 'A' })

          if (Object.keys(groupsData[0]).length) {
            const [namesArr, ...restArr] = groupsData

            const groupsResult: GroupType[] = []

            for (const key in namesArr) {
              if (namesArr[key]) {
                const obj = restArr.reduce((acc: GroupType, item) => {
                  if (item['A']) {
                    // @ts-expect-error types
                    acc[item['A']] = item[key] || null
                  }

                  return acc
                }, { name: String(namesArr[key]) } as GroupType)

                groupsResult.push(obj)
              }
            }

            setGroupsList(groupsResult)
          }
        }

        // Список страниц в навигации слева
        const stepsList = workbook.SheetNames.filter((sheetName) => sheetName !== 'products' && sheetName !== 'groups')

        setStepsList(stepsList)

        // Возможная обработка на случай необходимости наличия шагов с вопросами
        // if (!stepsList.length) {
        //   throw new Error('No question blocks found')
        // }

        // Questions Map
        const questionsData = workbook.Sheets
        delete questionsData['products']
        delete questionsData['groups']

        const questionsMap: QuestionsType = new Map()

        for (const sheet in questionsData) {
          const sheetData = utils.sheet_to_json<SheetToJSONType>(questionsData[sheet], { header: 'A' })

          const itemsXLSXMap = sheetData[0]

          const stepObj = {
            stepTitle: sheetData[0]['A'] ? String(sheetData[0]['A']) : null,
            blocks: new Map() as Map<string, BlockMapType>,
          }

          for (let i = 1; i < sheetData.length; i++) {
            const possibleBlockName = sheetData[i]['A']

            // Если вдруг обосрались со структурой документа и нет блока второй строкой
            if (i === 1 && !possibleBlockName) {
              stepObj.blocks.set('', {
                questions: new Map()
              })

              continue
            }

            if (possibleBlockName as string) {
              stepObj.blocks.set(String(possibleBlockName), {
                questions: new Map()
              })
            } else {
              const question = sheetData[i]['B']

              if (question) {
                const lastKey = [...stepObj.blocks.keys()].pop()

                if (!lastKey) {
                  continue
                }

                const valuesObj = structuredClone(sheetData[i])
                delete valuesObj['B']

                const parsedValuesObj: { [key: string]: number } = {}

                for (const key in valuesObj) {
                  const itemName = String(itemsXLSXMap[key])
                  parsedValuesObj[itemName] = isNaN(Number(valuesObj[key])) ? 0 : Number(valuesObj[key])
                }

                stepObj.blocks.get(lastKey)?.questions.set(String(question), {
                  answer: null,
                  values: parsedValuesObj,
                })
              }
            }
          }

          questionsMap.set(sheet, stepObj)
        }

        setQuestions(questionsMap)
      })
      .catch((error) => {
        alert(error)
      })
  }, [language])

  // Effects
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sourceUrl = urlParams.get('source');

    const getSheetId = (url: string) => {
      const match = url.match(/\/d\/(.*?)(\/|$)/);

      return match ? match[1] : null;
    }

    const docID = sourceUrl ? getSheetId(sourceUrl) : null

    if (docID) {
      setXlsxUrl(`https://docs.google.com/spreadsheets/d/${docID}/export?format=xlsx`);
    }
  }, [])

  useEffect(() => {
    if (xlsxUrl) {
      void getInitialData(xlsxUrl)
    }
  }, [getInitialData, xlsxUrl])

  // Handlers
  const refreshData = useCallback(() => {
    if (xlsxUrl) {
      void getInitialData(xlsxUrl)
    }

    setPersonalInfo(initialPersonalInfoFormData())
  }, [getInitialData, xlsxUrl])

  // Renders
  return (
    <Stack alignItems="stretch" gap={1.5}>
      <Typography variant="h4" fontSize={28} px={2}>
        {t('screens.main.title')}
      </Typography>

      {step === MainPageSteps.INFO && (
        <InfoStep
          personalInfo={personalInfo}
          setPersonalInfo={setPersonalInfo}
          setStep={setStep}
        />
      )}

      {step === MainPageSteps.CALC && (
        <CalculatorStep
          step={step}
          setStep={setStep}
          stepsList={stepsList}
          setQuestions={setQuestions}
          questions={questions}
        />
      )}

      {step === MainPageSteps.RESULTS && (
        <ResultsStep
          initData={initData}
          setStep={setStep}
          refresh={refreshData}
          questions={questions}
          groups={groupsList}
          itemsList={itemsList}
        />
      )}
    </Stack>
  )
}

export { MainPage }
