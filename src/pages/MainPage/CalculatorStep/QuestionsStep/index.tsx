import {ChangeEvent, memo, useCallback} from 'react'
import {
  Accordion, AccordionDetails,
  AccordionSummary,
  FormControl,
  FormControlLabel,
  FormLabel, Paper,
  Radio,
  RadioGroup,
  Stack,
  Typography
} from "@mui/material";
import {useTranslation} from "react-i18next";
import {makeStyles} from "tss-react/mui";

import {ValueOption} from "../../../../types/valueOption";
import {QuestionMapType, StepMapType} from "../../../../types/questions";

interface QuestionsStepProps {
  activeBlock: StepMapType
  setActiveBlock(activeBlock: StepMapType): void
}

const QuestionsStep = memo(({
  activeBlock, setActiveBlock,
}: QuestionsStepProps) => {
  const { t } = useTranslation()

  const { classes } = useStyles()

  // Handlers
  const selectOption = useCallback((e: ChangeEvent<HTMLInputElement>, blockName: string, question: string) => {
    const { value } = e.target

    const newActiveBlock = structuredClone(activeBlock)

    const answeredQuestion = newActiveBlock.blocks.get(blockName)?.questions.get(question)

    if (answeredQuestion) {
      newActiveBlock.blocks.get(blockName)?.questions.set(
        question,
        {...answeredQuestion, answer: value === 'true'},
      )

      setActiveBlock(newActiveBlock)
    }
  }, [setActiveBlock, activeBlock])

  // Renders
  const renderQuestion = useCallback((question: string, questionData: QuestionMapType, blockName: string) => (
    <Stack key={question}>
      <FormControl>
        <FormLabel id={question}>
          {question}
        </FormLabel>

        <RadioGroup
          aria-labelledby={question}
          name={question}
          row
          value={questionData.answer}
          onChange={(e) => selectOption(e, blockName, question)}
        >
          <FormControlLabel
            value={true}
            control={<Radio size="small" />}
            label={t(`radio.value.${ValueOption.YES}`)}
          />

          <FormControlLabel
            value={false}
            control={<Radio size="small" />}
            label={t(`radio.value.${ValueOption.NO}`)}
          />
        </RadioGroup>
      </FormControl>
    </Stack>
  ), [selectOption, t])

  return (
    <Stack gap={1}>
      {activeBlock.stepTitle && (
        <Paper square style={{ padding: '8px 16px' }}>
          <Typography variant="subtitle1">{activeBlock.stepTitle}</Typography>
        </Paper>
      )}

      {[...activeBlock.blocks].map(([blockName, blockInfo]) => (
        <Accordion
          key={blockName}
          disableGutters
          elevation={0}
          square
          slotProps={{ transition: { unmountOnExit: true } }}
          defaultExpanded
          className={classes.accordion}
        >
          <AccordionSummary className={classes.summary}>
            <Typography>{blockName}</Typography>
          </AccordionSummary>

          <AccordionDetails className={classes.details}>
            <Stack>
              {[...blockInfo.questions].map((data) => renderQuestion(...data, blockName))}
            </Stack>
          </AccordionDetails>
        </Accordion>
      ))}
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

export { QuestionsStep }
