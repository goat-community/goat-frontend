import React, { useMemo } from "react";
import { Box } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { accessibilityIndicatorBaseSchema } from "@/lib/validations/tools";
import { sendOevGuetenKlassenRequest } from "@/lib/api/tools";
import { useParams } from "next/navigation";
import { accessibilityIndicatorsStaticPayload } from "@/lib/constants/payloads";
import ToolboxActionButtons from "@/components/map/panels/common/ToolboxActionButtons";
import { toast } from "react-toastify";

import ReferenceAreLayer from "@/components/map/panels/toolbox/tools/oevGuetenklassen/ReferenceAreLayer";
import IndicatorTimeSettings from "@/components/map/panels/toolbox/tools/oevGuetenklassen/IndicatorTimeSettings";

import type { PostOevGuetenKlassen } from "@/lib/validations/tools";

const OevGuetenklassen = () => {

  const { projectId } = useParams();

  const {
    register,
    reset,
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
        from_time: 25200,
        to_time: 32400,
      },
      reference_area_layer_project_id: 0,
      station_config: accessibilityIndicatorsStaticPayload,
    },
  });

  const watchFormValues = watch();

  const getCurrentValues = useMemo(() => {
    return watchFormValues;
  }, [watchFormValues]);

  function handleReset() {
    reset();
  }

  function handleRun() {
    toast.info("Oev-GutenKlassen is running");
    sendOevGuetenKlassenRequest(getValues(), projectId as string)
    .then((data) =>
    data.ok
    ? toast.success("Oev-GutenKlassen tool is successful")
    : toast.error("Oev-GutenKlassen tool failed"),
    )
    .catch(() => {
      toast.error("Oev-GutenKlassen has failed");
    });
    reset();
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
    </Box>
  );
};

export default OevGuetenklassen;
