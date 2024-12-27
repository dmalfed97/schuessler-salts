import {memo, useEffect, useMemo, useState} from 'react'
import {Button, FormGroup, Paper, Stack, Typography, FormControlLabel, Checkbox, Link} from "@mui/material";
import {useTranslation} from "react-i18next";
import {FormProvider, SubmitHandler, useForm} from "react-hook-form";
import {yupResolver} from '@hookform/resolvers/yup'

import {MainPageSteps} from "../steps";
import {PersonalInfoFormType, PersonalInfoValidationSchema} from "./validation";
import {TextFieldWithController} from "../../../components/TextFieldWithController";
import {OrderData} from "../../../types/orderData";
import {appConfig} from "../../../config";

interface InfoStepProps {
  orderData: OrderData
  personalInfo: PersonalInfoFormType
  setPersonalInfo(info: PersonalInfoFormType): void
  setStep(newStep: MainPageSteps): void
}

const InfoStep = memo(({ setStep, personalInfo, setPersonalInfo, orderData }: InfoStepProps) => {
  const { t } = useTranslation()

  const [privacyPolicyIsAccepted, setPrivacyPolicyIsAccepted] = useState<boolean>(true)
  const [personalDataIsAccepted, setPersonalDataIsAccepted] = useState<boolean>(true)

  const methods = useForm<PersonalInfoFormType>({
    mode: 'onChange',
    reValidateMode: 'onChange',
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
  const { control, handleSubmit, reset, formState } = methods

  // Effects
  useEffect(() => {
    reset(personalInfo)
  }, [personalInfo, reset])

  // Handlers
  const onSubmit: SubmitHandler<PersonalInfoFormType> = (values) => {
    setPersonalInfo(values)

    setStep(MainPageSteps.CALC)
  }

  const buttonIsDisabled = useMemo(() => {
    return !orderData.token || !orderData.data || !privacyPolicyIsAccepted || !personalDataIsAccepted || !formState.isValid
  }, [formState.isValid, orderData.data, orderData.token, personalDataIsAccepted, privacyPolicyIsAccepted])

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

            <FormGroup>
              <FormControlLabel
                control={<Checkbox
                  checked={privacyPolicyIsAccepted}
                  onChange={(_, checked) => setPrivacyPolicyIsAccepted(checked)}
                />}
                label={(
                  <Link href={appConfig.privacyPolicyUrl} target="_blank">
                    {t('screens.main.form.privacyPolicyLabel')}
                  </Link>
                )}
              />

              <FormControlLabel
                control={<Checkbox
                  checked={personalDataIsAccepted}
                  onChange={(_, checked) => setPersonalDataIsAccepted((checked))}
                />}
                label={(
                  <Link href={appConfig.personalDataAcceptanceUrl} target="_blank">
                    {t('screens.main.form.personalDataAcceptanceLabel')}
                  </Link>
                )}
              />
            </FormGroup>

            <Stack direction="row" justifyContent="flex-end">
              <Button variant="contained" type="submit" disabled={buttonIsDisabled}>
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
