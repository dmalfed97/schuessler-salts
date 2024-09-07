import {memo, MouseEvent, useMemo, useEffect, useState} from 'react'
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Typography,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Link,
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {useTranslation} from "react-i18next";
import {makeStyles} from "tss-react/mui";

import {appConfig} from '../../../config'
import {MainPageSteps} from "../steps";
import {BlockMapType, QuestionsType} from "../../../types/questions";
import {CalculationResultsType} from "../../../types/results";
import {ItemsMap} from "../../../types/items";
import {GroupType} from "../../../types/group";
import {PersonalInfoFormType} from "../InfoStep/validation";
import {getZodiacSign} from "../../../utils/_getZodiacSign";
import {calculateAge} from "../../../utils/_getAge";

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

  const { classes } = useStyles()

  const [resultsAreReady, setResultsAreReady] = useState<boolean>(false)

  // Helpers
  const results = useMemo((): CalculationResultsType[] => {
    const itemsResultList = [...itemsList].map(([itemName, itemData]) => ({
      name: itemName,
      img: itemData.img ? String(itemData.img) : null,
      description: itemData.description ? String(itemData.description) : null,
      long_description: itemData.long_description ? String(itemData.long_description) : null,
      composition: itemData.composition ? String(itemData.composition) : null,
      prescription_14: itemData.prescription_14 ? String(itemData.prescription_14) : null,
      prescription_8: itemData.prescription_8 ? String(itemData.prescription_8) : null,
      prescription_2: itemData.prescription_2 ? String(itemData.prescription_2) : null,
      prescription_0: itemData.prescription_0 ? String(itemData.prescription_0) : null,
      group: String(itemData.group),
      score: 0,
    }))

    const zodiacStep = questions.get('zodiac')

    if (zodiacStep) {
      const zodiacBlock: IteratorResult<BlockMapType, BlockMapType> = zodiacStep.blocks.values().next()

      if (zodiacBlock) {
        const zodiacSign = getZodiacSign(new Date(personalInfo.dateOfBirth))

        const bufferBlockValue = zodiacBlock.value.questions.get(zodiacSign)

        if (bufferBlockValue) {
          zodiacBlock.value.questions.set(zodiacSign, { ...bufferBlockValue, answer: true })
        }
      }
    }

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
  }, [questions, itemsList, personalInfo])

  // Effects
  useEffect(() => {
    if (resultsAreReady && results.length && personalInfo.email) {
      const age = calculateAge(personalInfo.dateOfBirth)
      const generalText = age > 14 ? t(`prescriptions.14+`)
        : age > 8 ? t(`prescriptions.8-14`)
          : age > 2 ? t(`prescriptions.2-8`)
            : t(`prescriptions.0-2`)

      const message = {
        type: 'QUESTIONNAIRE_COMPLETE',
        content: {
          paymentId: initData?.paymentId || '',
          age,
          prescription: generalText,
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
  }, [resultsAreReady, results, initData, personalInfo, groups, t])

  // Handlers
  const refreshScoreBoard = (e: MouseEvent): void => {
    e.stopPropagation()

    const message = {
      type: 'NEW_QUESTIONNAIRE',
      content: {
        paymentId: initData?.paymentId || '',
      },
    }
    window.parent.postMessage(message, '*')

    refresh()

    setStep(MainPageSteps.INFO)
  }

  // Renders
  const renderResults = useMemo(() => {
    return results.map((resultsGroup) => (
      <Stack key={resultsGroup.group} gap={1}>
        {resultsGroup.items
          .sort((a, b) => (a.score > b.score) ? -1 : 1)
          .slice(0, groups.find((group) => group.name === resultsGroup.group)?.count || appConfig.defaultItemsCount)
          .map((item) => (
            <Card key={item.name}>
              <CardMedia image={item.img!} sx={{ height: 150, backgroundSize: 'contain' }} />

              <CardContent>
                <Typography variant="subtitle1">{`${t('word.salt')}: ${item.name}`}</Typography>

                <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>{item.description || ''}</Typography>

                {/*<Typography variant="body2">Score: {item.score}</Typography>*/}
              </CardContent>
            </Card>
            )
          )}
      </Stack>
    ))
  }, [groups, results, t])

  const renderPrescriptionBlock = useMemo(() => {
    const age = calculateAge(personalInfo.dateOfBirth)
    const generalText = age > 14 ? t(`prescriptions.14+`)
      : age > 8 ? t(`prescriptions.8-14`)
        : age > 2 ? t(`prescriptions.2-8`)
          : t(`prescriptions.0-2`)

    const prescriptionKey = age > 14 ? 'prescription_14'
      : age > 8 ? 'prescription_8'
        : age > 2 ? 'prescription_2'
          : 'prescription_0'

    return (
      <Stack gap={1}>
        <Accordion
          disableGutters
          elevation={0}
          square
          slotProps={{ transition: { unmountOnExit: true } }}
          defaultExpanded={false}
          className={classes.accordion}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />} className={classes.summary}>
            <Typography variant="h6">{t('word.howToUse')}</Typography>
          </AccordionSummary>

          <AccordionDetails className={classes.details}>
            <Stack gap={2}>
              <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
                {generalText}
              </Typography>

              {results.map((resultsGroup) => resultsGroup.items
                .sort((a, b) => (a.score > b.score) ? -1 : 1)
                .slice(0, groups.find((group) => group.name === resultsGroup.group)?.count || appConfig.defaultItemsCount)
                .map((item) => (
                  <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
                    {item[prescriptionKey] || ''}
                  </Typography>
                ))
              )}
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Stack>
    )
  }, [personalInfo.dateOfBirth, classes.accordion, classes.summary, classes.details, t, results, groups])

  const renderContactBlock = useMemo(() => {
    return (
      <Paper component={Stack} gap={1} sx={{ padding: 2 }}>
        <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
          {t('contactData.resultIsSent')}
        </Typography>

        <Typography variant="body2" style={{ whiteSpace: 'pre-wrap' }}>
          <b>{t('contactData.site')}</b>
          <Link href={`http://${t('contactData.siteUrl')}`}>{t('contactData.siteUrl')}</Link>
        </Typography>

        <Typography variant="body2" style={{ whiteSpace: 'pre-wrap' }}>
          <b>{t('contactData.phone')}</b>
          <Link href={`tel:${t('contactData.phoneNumber')}`}>{t('contactData.phoneNumber')}</Link>
        </Typography>

        <Typography variant="body2" style={{ whiteSpace: 'pre-wrap' }}>
          <b>{t('contactData.email')}</b>
          <Link href={`mailto:${t('contactData.emailValue')}`}>{t('contactData.emailValue')}</Link>
        </Typography>
      </Paper>
    )
  }, [t])

  return (
    <Stack alignItems="stretch" gap={2}>
      <Typography variant="h5" textAlign="center">
        {t('screens.main.results')}
      </Typography>

      <Alert variant="outlined" severity="error" style={{ fontSize: 18 }}>
        {t('disclaimer')}
      </Alert>

      <Stack gap={2}>
        <Typography variant="h6">
          {t('word.yourResult')}
        </Typography>

        {renderResults}

        {renderPrescriptionBlock}

        {renderContactBlock}
      </Stack>

      <Stack direction="row" justifyContent="flex-end">
        <Button variant="contained" onClick={refreshScoreBoard}>
          {t('button.calculateAgain')}
        </Button>
      </Stack>
    </Stack>
  )
})

const useStyles = makeStyles()((theme) => ({
  accordion: {
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&::before': {
      display: 'none',
    }
  },
  summary: {
    flexDirection: 'row-reverse',
  },
  details: {
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
  }
}))

export { ResultsStep }
