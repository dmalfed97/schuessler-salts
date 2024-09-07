import {ChangeEvent, memo, useCallback} from 'react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Paper,
  Stack,
  Typography
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {makeStyles} from "tss-react/mui";

import {QuestionMapType, StepMapType} from "../../../../types/questions";

interface QuestionsStepProps {
  activeBlock: StepMapType
  setActiveBlock(activeBlock: StepMapType): void
}

const QuestionsStep = memo(({
  activeBlock, setActiveBlock,
}: QuestionsStepProps) => {
  const { classes } = useStyles()

  // Handlers
  const selectOption = useCallback((e: ChangeEvent<HTMLInputElement>, blockName: string, question: string) => {
    const { checked } = e.target

    const newActiveBlock = structuredClone(activeBlock)

    const answeredQuestion = newActiveBlock.blocks.get(blockName)?.questions.get(question)

    if (answeredQuestion) {
      newActiveBlock.blocks.get(blockName)?.questions.set(
        question,
        {...answeredQuestion, answer: checked},
      )

      setActiveBlock(newActiveBlock)
    }
  }, [setActiveBlock, activeBlock])

  // Renders
  const renderQuestion = useCallback((question: string, questionData: QuestionMapType, blockName: string) => (
    <FormGroup key={question}>
      <FormControlLabel
        control={
          <Checkbox
            checked={!!questionData.answer}
            onChange={(e) => selectOption(e, blockName, question)}
          />
        }
        label={question}
      />
    </FormGroup>
  ), [selectOption])

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
          <AccordionSummary expandIcon={<ExpandMoreIcon />} className={classes.summary}>
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
