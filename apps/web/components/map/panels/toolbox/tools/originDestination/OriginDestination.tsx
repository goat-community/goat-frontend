import React, { useMemo } from "react";
import { Box } from "@mui/material";
import { originDestinationBaseSchema } from "@/lib/validations/tools";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputLayer from "@/components/map/panels/toolbox/tools/originDestination/InputLayer";
import ODSettings from "@/components/map/panels/toolbox/tools/originDestination/ODSettings";
import ToolboxActionButtons from "@/components/map/panels/common/ToolboxActionButtons";
import { sendODRequest } from "@/lib/api/tools";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";

import type { PostOriginDestination } from "@/lib/validations/tools";

const OriginDestination = () => {
  const { projectId } = useParams();

  const {
    register,
    reset,
    watch,
    getValues,
    setValue,
    trigger,
    formState: { errors, isValid },
  } = useForm<PostOriginDestination>({
    mode: "onChange",
    resolver: zodResolver(originDestinationBaseSchema),
    defaultValues: {
      geometry_layer_project_id: 0,
      origin_destination_matrix_layer_project_id: 0,
      unique_id_column: "",
      origin_column: "",
      destination_column: "",
      weight_column: "",
    },
  });

  const watchFormValues = watch();

  const getCurrentValues = useMemo(() => {
    return watchFormValues;
  }, [watchFormValues]);

  const handleReset = () => {
    reset();
  };

  const handleRun = () => {
    toast.info("Origin Destination is running");
    sendODRequest(getValues(), projectId as string)
      .then((data) =>
        data.ok
          ? toast.success("Origin Destination tool is successful")
          : toast.error("Origin Destination tool failed"),
      )
      .catch(() => {
        toast.error("Origin Destination tool failed");
      });
    reset();
  };

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
        <InputLayer
          register={register}
          watch={getCurrentValues}
          errors={errors}
          setValue={setValue}
        />

        <ODSettings
          register={register}
          watch={getCurrentValues}
          errors={errors}
          setValue={setValue}
          trigger={trigger}
        />
      </Box>
      <ToolboxActionButtons
        runFunction={handleRun}
        runDisabled={!isValid}
        resetFunction={handleReset}
        resetDisabled={
          !getCurrentValues.geometry_layer_project_id &&
          !getCurrentValues.destination_column &&
          !getCurrentValues.origin_column &&
          !getCurrentValues.origin_destination_matrix_layer_project_id &&
          !getCurrentValues.unique_id_column &&
          !getCurrentValues.weight_column
        }
      />
    </Box>
  );
};

export default OriginDestination;
