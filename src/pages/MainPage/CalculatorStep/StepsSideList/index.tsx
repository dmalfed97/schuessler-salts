import {memo, MouseEvent} from 'react'
import {List, ListItemButton, ListItemText, Paper, useTheme} from "@mui/material";
import {useTranslation} from "react-i18next";

import {MainPageSteps} from "../../steps";

interface StepsSideListProps {
  step: MainPageSteps
  stepsList: string[]
  activeBlockIndex: string
  setStep(step: MainPageSteps): void
  setActiveBlockIndex(block: string): void
}

const StepsSideList = memo(({
  stepsList, activeBlockIndex, setActiveBlockIndex, setStep, step,
}: StepsSideListProps) => {
  const { t } = useTranslation()

  const { palette } = useTheme()

  // Handlers
  const toOtherQuestionsBlock = (step: string) => (e: MouseEvent) => {
    e.stopPropagation()

    setActiveBlockIndex(step)
  }

  // Renders
  return (
    <Paper square style={{ flexShrink: 0 }}>
      <List dense>
        <ListItemButton
          onClick={() => setStep(MainPageSteps.INFO)}
          style={step === MainPageSteps.INFO ? {
            backgroundColor: palette.primary.light,
            color: 'white'
          } : {}}
        >
          <ListItemText sx={{ '> span': { fontSize: '1rem' }}}>
            {t('button.personalInfo')}
          </ListItemText>
        </ListItemButton>

        {stepsList.map((step) => (
          <ListItemButton
            key={step}
            onClick={toOtherQuestionsBlock(step)}
            style={step === activeBlockIndex ? {
              backgroundColor: palette.primary.light,
              color: 'white',
            } : {}}
          >
            <ListItemText sx={{ '> span': { fontSize: '1rem' }}}>
              {step}
            </ListItemText>
          </ListItemButton>
        ))}
      </List>
    </Paper>
  )
})

export { StepsSideList }
