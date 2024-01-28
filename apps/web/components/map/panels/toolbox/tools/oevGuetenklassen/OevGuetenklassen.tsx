import React, { useMemo } from "react";
import { Box } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { accessibilityIndicatorBaseSchema } from "@/lib/validations/tools";
import { sendOevGuetenKlassenRequest } from "@/lib/api/tools";
import { useParams } from "next/navigation";
import { accessibilityIndicatorsStaticPayload } from "@/lib/constants/payloads";
import ToolboxActionButtons from "@/components/map/panels/common/ToolboxActionButtons";

import ReferenceAreLayer from "@/components/map/panels/toolbox/tools/oevGuetenklassen/ReferenceAreLayer";
import IndicatorTimeSettings from "@/components/map/panels/toolbox/tools/oevGuetenklassen/IndicatorTimeSettings";

import type { PostOevGuetenKlassen } from "@/lib/validations/tools";

const OevGuetenklassen = () => {
  // const { t } = useTranslation("maps");

  const { projectId } = useParams();

  const {
    register,
    // reset,
    watch,
    getValues,
    setValue,
    formState: { errors, isValid },
  } = useForm<PostOevGuetenKlassen>({
    mode: "onChange",
    resolver: zodResolver(accessibilityIndicatorBaseSchema),
    defaultValues: {
      time_window: {
        weekday: "weekday",
        from_time: 2000,
        to_time: 5000,
      },
      reference_area_layer_project_id: 0,
      station_config: accessibilityIndicatorsStaticPayload,
    },
  });

  const watchFormValues = watch();

  const getCurrentValues = useMemo(() => {
    return watchFormValues;
  }, [watchFormValues]);

  console.log(errors, isValid, getCurrentValues);

  function handleReset() {}

  function handleRun() {
    sendOevGuetenKlassenRequest(getValues(), projectId as string);
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      sx={{ height: "100%" }}
    >
      <Box
        sx={{
          height: "95%",
          maxHeight: "95%",
          overflow: "scroll",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
        }}
      >
        <IndicatorTimeSettings
          setValue={setValue}
          watch={getCurrentValues}
          errors={errors}
        />

        <ReferenceAreLayer
          register={register}
          watch={getCurrentValues}
          errors={errors}
        />
      </Box>
      <ToolboxActionButtons
        runFunction={handleRun}
        runDisabled={!isValid}
        resetFunction={handleReset}
        resetDisabled={
          !getCurrentValues.time_window.weekday &&
              !getCurrentValues.time_window.from_time &&
              !getCurrentValues.time_window.to_time &&
              !getCurrentValues.reference_area_layer_project_id
        }
      />
      {/* <Box
        sx={{
          position: "relative",
          maxHeight: "5%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: theme.spacing(2),
            alignItems: "center",
            position: "absolute",
            bottom: "-25px",
            left: "-8px",
            width: "calc(100% + 16px)",
            padding: "16px",
            background: "white",
            boxShadow: "0px -5px 10px -5px rgba(58, 53, 65, 0.1)",
          }}
        >
          <Button
            color="error"
            variant="outlined"
            sx={{ flexGrow: "1" }}
            onClick={handleReset}
            disabled={
              !getCurrentValues.time_window.weekday &&
              !getCurrentValues.time_window.from_time &&
              !getCurrentValues.time_window.to_time &&
              !getCurrentValues.reference_area_layer_project_id
            }
          >
            {t("panels.tools.reset")}
          </Button>
          <Button
            sx={{ flexGrow: "1" }}
            onClick={handleRun}
            disabled={!isValid}
          >
            {t("panels.tools.run")}
          </Button>
        </Box>
      </Box> */}
    </Box>
  );
};

export default OevGuetenklassen;
