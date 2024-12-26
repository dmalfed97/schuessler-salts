import {memo, useMemo, useEffect, useState, useCallback} from 'react'
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
import {OrderData} from "../../../types/orderData";
import {SubmitFormPayload, SubmitFormResponse} from "../../../types/wpResponses";

interface ResultsStepProps {
  orderData: OrderData
  questions: QuestionsType
  groups: GroupType[]
  itemsList: ItemsMap
  personalInfo: PersonalInfoFormType
  refresh(): void // Not used
  setStep(newStep: MainPageSteps): void // Not used
}

const ResultsStep = memo(({
  questions, itemsList, groups, orderData, personalInfo,
}: ResultsStepProps) => {
  const { t } = useTranslation()

  const { classes } = useStyles()

  const [resultsAreReady, setResultsAreReady] = useState<boolean>(false)
  const [resultsProcessedSuccessfully, setResultsProcessedSuccessfully] = useState<boolean>(true)

  // Helpers
  const calculationResults = useMemo((): CalculationResultsType[] => {
    const itemsResultList = [...itemsList].map(([itemName, itemData]) => ({
      name: itemName || '',
      img: itemData.img ? String(itemData.img) : '',
      description: itemData.description ? String(itemData.description) : '',
      long_description: itemData.long_description ? String(itemData.long_description) : '',
      composition: itemData.composition ? String(itemData.composition) : '',
      prescription_14: itemData.prescription_14 ? String(itemData.prescription_14) : '',
      prescription_8: itemData.prescription_8 ? String(itemData.prescription_8) : '',
      prescription_2: itemData.prescription_2 ? String(itemData.prescription_2) : '',
      prescription_0: itemData.prescription_0 ? String(itemData.prescription_0) : '',
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

  const postResults = useCallback(async (mappedResults: SubmitFormPayload): Promise<SubmitFormResponse> => {
    const result = await fetch(
      `${appConfig.apiEndpoint}/wp-json/myplugin/v1/authors/${orderData.data}/?token=${orderData.token}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mappedResults),
      }
    )

    if (!result.ok) {
      throw new Error('An error happened on request to WP order')
    }

    return await result.json()
  }, [orderData.data, orderData.token])

  // Effects
  useEffect(() => {
    if (resultsAreReady && calculationResults.length) {
      if (orderData.data && orderData.token) {
        postResults({
          customer: {
            firstname: personalInfo.firstName,
            secondname: personalInfo.secondName,
            lastname: personalInfo.lastName,
            email: personalInfo.email,
            phone: personalInfo.phone,
            dateofbird: personalInfo.dateOfBirth,
          },
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          checkboxes: Array.from(questions).map(([stepTitle, step]) => ({
            title: stepTitle,
            sections: Array.from(step.blocks).map(([blockKey, block]) => ({
              title: blockKey,
              checked: Array.from(block.questions.entries())
                .filter(([, question]) => question.answer === true)
                .map(([questionKey]) => questionKey),
            })),
          })),
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          rezults: calculationResults.flatMap((group) => group.items.map(({ score, name: itemName, ...item }) => ({
            ...item,
            salt: itemName,
            group: group.group,
          }))),
        })
          .then((response) => {
            if (!response?.status) {
              setResultsProcessedSuccessfully(false)
            }
          })
          .catch(() => {
            setResultsProcessedSuccessfully(false)
          })
      } else {
        setResultsProcessedSuccessfully(false)
      }
    }
  }, [orderData.data, orderData.token, postResults, resultsAreReady, personalInfo, calculationResults, questions])

  // Renders
  const renderResults = useMemo(() => {
    return calculationResults.map((resultsGroup) => (
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
  }, [groups, calculationResults, t])

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

              {calculationResults.map((resultsGroup) => resultsGroup.items
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
  }, [personalInfo.dateOfBirth, classes.accordion, classes.summary, classes.details, t, calculationResults, groups])

  const renderContactBlock = useMemo(() => {
    return (
      <Paper component={Stack} gap={1} sx={{ padding: 2 }}>
        <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
          {t('contactData.resultIsSent')}
        </Typography>

        <Typography variant="body2" style={{ whiteSpace: 'pre-wrap' }}>
          <b>{t('contactData.site')}</b>
          <Link href={`http://${t('contactData.siteUrl')}`} target="_blank">
            {t('contactData.siteUrl')}
          </Link>
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

      {!resultsProcessedSuccessfully && (
        <Alert variant="filled" severity="error">
          {t('screens.main.alert')}
        </Alert>
      )}

      <Stack direction="row" justifyContent="space-between">
        <Button variant="contained" onClick={() => window.open(appConfig.completeAgainUrl, '_blank')}>
          {t('button.calculateAgain')}
        </Button>

        <Button variant="contained" onClick={() => window.print()}>
          {t('button.print')}
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
