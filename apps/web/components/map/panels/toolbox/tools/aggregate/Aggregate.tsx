import React, { useMemo } from "react";
import SelectArea from "@/components/map/panels/toolbox/tools/aggregate/SelectArea";
import Statistics from "@/components/map/panels/toolbox/tools/aggregate/Statistics";
import { Box } from "@mui/material";
import { useForm } from "react-hook-form";
import { sendAggregateFeatureRequest } from "@/lib/api/tools";
import InputLayer from "@/components/map/panels/toolbox/tools/aggregate/InputLayer";
import { zodResolver } from "@hookform/resolvers/zod";
import { AggregateBaseSchema } from "@/lib/validations/tools";
import ToolboxActionButtons from "@/components/map/panels/common/ToolboxActionButtons";
import { toast } from "react-toastify";

import type { PostAggregate } from "@/lib/validations/tools";

interface AggregateProps {
  projectId: string;
}

const Aggregate = (props: AggregateProps) => {
  const { projectId } = props;

  const {
    register,
    reset,
    watch,
    getValues,
    setValue,
    trigger,
    formState: { errors, isValid },
  } = useForm<PostAggregate>({
    mode: "onChange",
    resolver: zodResolver(AggregateBaseSchema),
    defaultValues: {
      source_layer_project_id: 0,
      area_type: "",
      source_group_by_field: [],
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
    const aggregateBodyRequest = getValues();

    if (aggregateBodyRequest.area_type === "h3_grid") {
      delete aggregateBodyRequest.aggregation_layer_project_id;
    } else {
      delete aggregateBodyRequest.h3_resolution;
    }

    toast.info("Aggregate Feature tool is running");
    sendAggregateFeatureRequest(getValues(), projectId)
      .then((data) =>
        data.ok
          ? toast.success("Aggregate Feature tool is successful")
          : toast.error("Aggregate Feature tool failed"),
      )
      .catch(() => {
        toast.error("Aggregate Feature tool failed");
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
        />
        <SelectArea
          register={register}
          watch={getCurrentValues}
          errors={errors}
        />
        <Statistics
          register={register}
          setValue={setValue}
          watch={getCurrentValues}
          errors={errors}
          trigger={trigger}
        />
      </Box>
      <ToolboxActionButtons
        runFunction={handleRun}
        runDisabled={!isValid}
        resetFunction={handleReset}
        resetDisabled={
          !getCurrentValues.aggregation_layer_project_id &&
          !getCurrentValues.area_type &&
          !getCurrentValues.column_statistics.operation &&
          !getCurrentValues.column_statistics.field &&
          !getCurrentValues.h3_resolution &&
          !getCurrentValues.source_group_by_field.length &&
          !getCurrentValues.source_layer_project_id
        }
      />
    </Box>
  );
};

export default Aggregate;
