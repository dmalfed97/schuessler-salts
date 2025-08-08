import {useEffect, useState, useCallback} from 'react'
import {useTranslation} from "react-i18next";
import {Button, Dialog, Stack, Typography} from "@mui/material";
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
import {appConfig} from "../../config";
import {OrderData} from "../../types/orderData";
import {useMuiMediaQuery} from "../../hooks/useMuiMediaQuesry";
import {deserializeQuestions} from "../../utils/_deserializeQuestions";
import {serializeQuestions} from "../../utils/_serializeQuestions";

const initialPersonalInfoFormData = () => ({
  firstName: '',
  secondName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
})

interface MainPageProps {
  orderData: OrderData
}

const MainPage = ({ orderData }: MainPageProps) => {
  const { t } = useTranslation('common')

  const { isSM } = useMuiMediaQuery()

  const [openSavedDataModal, setOpenSavedDataModal] = useState<boolean>(false)
  const [step, setStep] = useState<MainPageSteps>(MainPageSteps.INFO)
  const [questions, setQuestions] = useState<QuestionsType>(new Map())
  const [itemsList, setItemsList] = useState<ItemsMap>(new Map())
  const [stepsList, setStepsList] = useState<string[]>([])
  const [groupsList, setGroupsList] = useState<GroupType[]>([])
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoFormType>(initialPersonalInfoFormData())

  // Loader
  const getInitialData = useCallback(async (url: string) => {
    const fetchData = async () => {
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
        const stepsList = workbook.SheetNames.filter((sheetName) =>
          sheetName !== 'products'
          && sheetName !== 'groups'
          && sheetName !== 'zodiac'
        )

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
  }, [])

  // Effects
  useEffect(() => {
    void getInitialData(appConfig.xlsxUrl)
  }, [getInitialData])

  useEffect(() => {
    const previouslySavedData = localStorage.getItem(appConfig.savedDataStorageKey)

    if (previouslySavedData) {
      const parsedData = JSON.parse(previouslySavedData)

      if (parsedData.personalInfo || parsedData.questions) {
        setOpenSavedDataModal(true)
      }
    }
  }, [])

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (Object.values(personalInfo).some((val) => val)) {
        localStorage.setItem(appConfig.savedDataStorageKey, JSON.stringify({
          personalInfo: JSON.stringify(personalInfo),
          questions: serializeQuestions(questions),
        }))
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [personalInfo, questions])

  // Handlers
  const refreshData = useCallback(() => {
    void getInitialData(appConfig.xlsxUrl)

    setPersonalInfo(initialPersonalInfoFormData())
  }, [getInitialData])

  const parseSavedDataFromLocalStorage = () => {
    // Восстановление из localStorage
    const loadQuestionsFromStorage = (data: string | null): QuestionsType | null => {
      if (!data) return null

      try {
        const obj = JSON.parse(data)

        return deserializeQuestions(obj) as QuestionsType
      } catch (e) {
        console.error('Ошибка при восстановлении questions из localStorage:', e)
        return null
      }
    }

    setOpenSavedDataModal(false)
    const previouslySavedData = localStorage.getItem(appConfig.savedDataStorageKey)

    if (previouslySavedData) {
      const tempObj = JSON.parse(previouslySavedData)

      if (tempObj.personalInfo) {
        setPersonalInfo(JSON.parse(tempObj.personalInfo))
      }
      if (tempObj.questions) {
        const result = loadQuestionsFromStorage(tempObj.questions)

        if (result) {
          setQuestions(result)
        }
      }
    }
  }

  const handleCloseSavedDataModal = () => {
    setOpenSavedDataModal(false)
    localStorage.removeItem(appConfig.savedDataStorageKey)
  }

  // Renders
  return (
    <Stack alignItems="stretch" gap={1.5}>
      {step === MainPageSteps.INFO && (
        <InfoStep
          orderData={orderData}
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
          orderData={orderData}
          setStep={setStep}
          refresh={refreshData}
          questions={questions}
          groups={groupsList}
          itemsList={itemsList}
          personalInfo={personalInfo}
        />
      )}

      <Dialog open={openSavedDataModal} onClose={handleCloseSavedDataModal}>
        <Stack
          gap={6}
          alignItems="center"
          style={{
            backgroundColor: 'white',
            padding: 16,
            margin: 'auto',
          }}
        >
          <Typography variant="body1" whiteSpace="pre-line">
            {t('continueModal.text')}
          </Typography>

          <Stack alignSelf="center" direction={isSM ? 'row' : 'column'} gap={2}>
            <Button variant="outlined" onClick={handleCloseSavedDataModal}>
              {t('button.noBeginAgain')}
            </Button>

            <Button variant="contained" onClick={parseSavedDataFromLocalStorage}>
              {t('button.yesContinue')}
            </Button>
          </Stack>
        </Stack>
      </Dialog>
    </Stack>
  )
}

export { MainPage }
