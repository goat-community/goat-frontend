"use client";

import { postOrganizationSchema } from "@/lib/validations/organization";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Box,
  Button,
  Stack,
  Step,
  Checkbox,
  FormControlLabel,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useState, useRef, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import type * as z from "zod";
import AuthContainer from "@p4b/ui/components/AuthContainer";
import AuthLayout from "@p4b/ui/components/AuthLayout";
import { RhfAutocompleteField } from "@/components/common/form-inputs/AutocompleteField";
import { RhfSelectField } from "@/components/common/form-inputs/SelectField";
import { useOrganizationSetup } from "@/hooks/onboarding/OrganizationCreate";
import LoadingButton from "@mui/lab/LoadingButton";
import { useRouter } from "next/navigation";
import { createOrganization } from "@/lib/api/organizations";

type FormData = z.infer<typeof postOrganizationSchema>;

type ResponseResult = {
  message: string;
  status?: "error" | "success";
};
const STEPS = [
  "new_organization",
  "organization_profile",
  "organization_contact",
];

export default function OrganizationOnBoarding({ params: { lng } }) {
  const theme = useTheme();
  const { status, update } = useSession();
  const router = useRouter();
  const {
    t,
    countriesOptions,
    regionsOptions,
    orgTypesOptions,
    orgIndustryOptions,
    orgSizeOptions,
    orgUseCaseOptions,
  } = useOrganizationSetup(lng);

  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [responseResult, setResponseResult] = useState<ResponseResult>({
    message: "",
    status: undefined,
  });
  const [activeStep, setActiveStep] = useState<number>(0);
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const submitButtonRef = useRef<HTMLButtonElement>(null);

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
    control,
  } = useForm<FormData>({
    mode: "onChange",
    resolver: zodResolver(postOrganizationSchema),
    defaultValues: {
      region: "EU",
    },
  });

  const watchFormValues = watch();

  const allowNextFirstStep = useMemo(() => {
    return watchFormValues.name && watchFormValues.region && !errors.name;
  }, [errors.name, watchFormValues]);

  const allowNextSecondStep = useMemo(() => {
    return (
      watchFormValues.type &&
      watchFormValues.industry &&
      watchFormValues.department &&
      watchFormValues.use_case &&
      !errors.type &&
      !errors.industry &&
      !errors.department &&
      !errors.use_case
    );
  }, [
    watchFormValues,
    errors.type,
    errors.industry,
    errors.department,
    errors.use_case,
  ]);

  const allowSubmit = useMemo(() => {
    return (
      watchFormValues.name &&
      watchFormValues.region &&
      watchFormValues.type &&
      watchFormValues.industry &&
      watchFormValues.department &&
      watchFormValues.phone_number &&
      watchFormValues.location
    );
  }, [watchFormValues]);

  async function onSubmit(data: FormData) {
    console.log(data);
    setResponseResult({ message: "", status: undefined });
    setIsBusy(true);
    try {
      await createOrganization(data);
    } catch (_error) {
      setResponseResult({
        message: t("onboarding:organization_creation_error"),
        status: "error",
      });
    } finally {
      setIsBusy(false);
    }
    update();
    router.push("/");
  }

  return (
    <AuthLayout>
      {status == "authenticated" && (
        <AuthContainer
          headerTitle={
            <>
              <Stack sx={{ mb: 8 }} spacing={2}>
                <Typography variant="h5">
                  {t(`onboarding:${STEPS[activeStep]}_title`)}
                </Typography>
                <Typography variant="body2">
                  {t(`onboarding:${STEPS[activeStep]}_subtitle`)}
                </Typography>
              </Stack>
              <Box sx={{ width: "100%" }}>
                <Stepper activeStep={activeStep}>
                  {STEPS.map((label) => (
                    <Step key={label}>
                      <StepLabel>{t(`onboarding:${label}_stepper`)}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>
            </>
          }
          headerAlert={
            responseResult.status && (
              <Alert severity={responseResult.status}>
                {responseResult.message}
              </Alert>
            )
          }
          body={
            <>
              <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={theme.spacing(4)}>
                  <>
                    {activeStep == 0 && (
                      <>
                        <TextField
                          fullWidth
                          required
                          helperText={
                            errors.name
                              ? errors.name?.message
                              : t("onboarding:organization_name_desc")
                          }
                          label={t("onboarding:organization_name_label")}
                          id="name"
                          {...register("name")}
                          error={errors.name ? true : false}
                        />

                        <RhfSelectField
                          options={regionsOptions}
                          control={control}
                          name="region"
                          label={t("onboarding:organization_location_label")}
                        />
                      </>
                    )}
                    {activeStep == 1 && (
                      <>
                        <RhfSelectField
                          options={orgTypesOptions}
                          control={control}
                          name="type"
                          label={t("onboarding:organization_type_label")}
                        />

                        <RhfSelectField
                          options={orgSizeOptions}
                          control={control}
                          name="size"
                          label={t("onboarding:organization_size_label")}
                        />

                        <RhfSelectField
                          options={orgIndustryOptions}
                          control={control}
                          name="industry"
                          label={t("onboarding:organization_industry_label")}
                        />

                        <TextField
                          fullWidth
                          required
                          helperText={errors.name ? errors.name?.message : null}
                          label={t("onboarding:organization_department_label")}
                          {...register("department")}
                          error={errors.name ? true : false}
                        />

                        <RhfSelectField
                          options={orgUseCaseOptions}
                          control={control}
                          name="use_case"
                          label={t("onboarding:organization_use_case_label")}
                        />
                      </>
                    )}
                    {activeStep == 2 && (
                      <>
                        <TextField
                          disabled={isBusy}
                          fullWidth
                          required
                          type="number"
                          helperText={errors.name ? errors.name?.message : null}
                          label={t(
                            "onboarding:organization_contact_phone_label",
                          )}
                          {...register("phone_number")}
                          error={errors.name ? true : false}
                        />
                        <RhfAutocompleteField
                          disabled={isBusy}
                          options={countriesOptions}
                          control={control}
                          name="location"
                          label={t("onboarding:organization_location_label")}
                        />
                        <Controller
                          name="newsletter_subscribe"
                          control={control}
                          defaultValue={false}
                          render={({ field: { onChange, value } }) => {
                            return (
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    onChange={onChange}
                                    checked={value}
                                  />
                                }
                                label={t(
                                  "onboarding:organization_subscribe_to_newsletter",
                                )}
                              />
                            );
                          }}
                        />
                        <Stack spacing={2}>
                          <Typography variant="body1">
                            {t("onboarding:organization_onboarding_trial_note")}
                          </Typography>
                          <Typography variant="body2">
                            {t("onboarding:organization_accept_terms")}
                          </Typography>
                        </Stack>
                      </>
                    )}
                  </>
                </Stack>
                {activeStep == 2 && (
                  <LoadingButton
                    loading={isBusy}
                    variant="contained"
                    sx={{ mt: theme.spacing(8) }}
                    fullWidth
                    ref={submitButtonRef}
                    aria-label="finish-org-creation"
                    name="organization-submit"
                    type="submit"
                    disabled={!allowSubmit}
                  >
                    {t("onboarding:lets_get_started")}
                  </LoadingButton>
                )}

                <Stack>
                  {activeStep < 2 && (
                    <Button
                      fullWidth
                      sx={{
                        mt: theme.spacing(8),
                      }}
                      disabled={
                        activeStep == 0
                          ? !allowNextFirstStep
                          : !allowNextSecondStep
                      }
                      onClick={handleNext}
                    >
                      {t("common:next")}
                    </Button>
                  )}
                  {activeStep > 0 && (
                    <Button
                      sx={{
                        mt: theme.spacing(2),
                      }}
                      fullWidth
                      disabled={isBusy}
                      onClick={handleBack}
                      variant="text"
                    >
                      {t("common:back")}
                    </Button>
                  )}
                </Stack>
              </Box>
            </>
          }
        />
      )}
    </AuthLayout>
  );
}
