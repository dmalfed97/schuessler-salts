import {memo, useEffect} from 'react'
import {Button, Paper, Stack, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";
import {FormProvider, SubmitHandler, useForm} from "react-hook-form";
import {yupResolver} from '@hookform/resolvers/yup'

import {MainPageSteps} from "../steps";
import {PersonalInfoFormType, PersonalInfoValidationSchema} from "./validation";
import {TextFieldWithController} from "../../../components/TextFieldWithController";

interface InfoStepProps {
  personalInfo: PersonalInfoFormType
  setPersonalInfo(info: PersonalInfoFormType): void
  setStep(newStep: MainPageSteps): void
}

const InfoStep = memo(({ setStep, personalInfo, setPersonalInfo }: InfoStepProps) => {
  const { t } = useTranslation()

  const methods = useForm<PersonalInfoFormType>({
    defaultValues: {
      firstName: '',
      secondName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
    },
    // @ts-expect-error yup error
    resolver: yupResolver(PersonalInfoValidationSchema)
  })
  const { control, handleSubmit, reset } = methods

  // Effects
  useEffect(() => {
    reset(personalInfo)
  }, [personalInfo, reset])

  // Handlers
  const onSubmit: SubmitHandler<PersonalInfoFormType> = (values) => {
    setPersonalInfo(values)

    setStep(MainPageSteps.CALC)
  }

  // Renders
  return (
    <>
      <Typography variant="h4" fontSize={26} px={2}>
        {t('screens.main.title')}
      </Typography>

      <FormProvider {...methods}>
        <Paper square style={{ padding: '12px 16px' }}>
          <Stack
            gap={2}
            component="form"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Typography>
              {t('screens.main.greeting')}
            </Typography>

            <Stack gap={1}>
              <TextFieldWithController
                label={t('input.label.firstName')}
                name="firstName"
                hookFormProps={{control}}
                required
              />

              <TextFieldWithController
                label={t('input.label.secondName')}
                name="secondName"
                hookFormProps={{control}}
              />

              <TextFieldWithController
                label={t('input.label.lastName')}
                name="lastName"
                hookFormProps={{control}}
                required
              />

              <TextFieldWithController
                label={t('input.label.email')}
                name="email"
                hookFormProps={{control}}
                required
              />

              <TextFieldWithController
                label={t('input.label.phone')}
                name="phone"
                hookFormProps={{control}}
                mask="+7 (999) 999-99-99"
              />

              <TextFieldWithController
                label={t('input.label.dateOfBirth')}
                name="dateOfBirth"
                hookFormProps={{control}}
                type="date"
                required
              />
            </Stack>

            <Stack direction="row" justifyContent="flex-end">
              <Button variant="contained" type="submit">
                {t('button.continue')}
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </FormProvider>
    </>
  )
})

export { InfoStep }
