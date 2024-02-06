import React, { useMemo } from "react";
import FieldsToMatch from "@/components/map/panels/toolbox/tools/join/FieldsToMatch";
import Statistics from "@/components/map/panels/toolbox/tools/join/Statistics";
import { Box } from "@mui/material";
import { sendJoinFeatureRequest } from "@/lib/api/tools";
import { useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import InputLayer from "@/components/map/panels/toolbox/tools/join/InputLayer";
import { zodResolver } from "@hookform/resolvers/zod";
import { joinBaseSchema } from "@/lib/validations/tools";
import ToolboxActionButtons from "@/components/map/panels/common/ToolboxActionButtons";
import { toast } from "react-toastify";

import type { PostJoin } from "@/lib/validations/tools";

const Join = () => {
  const { projectId } = useParams();

  const {
    register,
    reset,
    watch,
    getValues,
    setValue,
    trigger,
    formState: { errors, isValid },
  } = useForm<PostJoin>({
    mode: "onChange",
    resolver: zodResolver(joinBaseSchema),
    defaultValues: {
      target_layer_project_id: 0,
      target_field: "",
      join_layer_project_id: 0,
      join_field: "",
      column_statistics: {
        operation: "",
        field: "",
      },
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
    toast.info("Join tool is running");
    sendJoinFeatureRequest(getValues(), projectId as string)
      .then((response) => {
        if (response.ok) {
          toast.success("Join layer has been created");
        } else {
          toast.error("Join tool has failed");
        }
      })
      .catch((err) => {
        toast.error(err);
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
          watch={getCurrentValues}
          setValue={setValue}
          register={register}
          errors={errors}
        />
        <FieldsToMatch
          register={register}
          watch={getCurrentValues}
          errors={errors}
          setValue={setValue}
        />
        <Statistics
          register={register}
          getValues={getValues}
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
          !getCurrentValues.join_layer_project_id &&
          !getCurrentValues.join_field &&
          !getCurrentValues.column_statistics.operation &&
          !getCurrentValues.column_statistics.field &&
          !getCurrentValues.target_layer_project_id &&
          !getCurrentValues.target_field
        }
      />
    </Box>
  );
};

export default Join;
