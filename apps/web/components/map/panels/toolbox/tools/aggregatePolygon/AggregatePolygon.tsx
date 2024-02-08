import React, { useMemo } from "react";
import SelectArea from "@/components/map/panels/toolbox/tools/aggregatePolygon/SelectArea";
import Statistics from "@/components/map/panels/toolbox/tools/aggregatePolygon/Statistics";
import { Box } from "@mui/material";
import { useForm } from "react-hook-form";
import { sendAggregatePolygonRequest } from "@/lib/api/tools";
import InputLayer from "@/components/map/panels/toolbox/tools/aggregatePolygon/InputLayer";
import { zodResolver } from "@hookform/resolvers/zod";
import { AggregatePolygonSchema } from "@/lib/validations/tools";
import ToolboxActionButtons from "@/components/map/panels/common/ToolboxActionButtons";
import { toast } from "react-toastify";

import type { PostAggregatePolygon } from "@/lib/validations/tools";

interface AggregateProps {
  projectId: string;
}

const AggregatePolygon = (props: AggregateProps) => {
  const { projectId } = props;
  
  const {
    register,
    reset,
    watch,
    getValues,
    setValue,
    trigger,
    formState: { errors, isValid },
  } = useForm<PostAggregatePolygon>({
    mode: "onChange",
    resolver: zodResolver(AggregatePolygonSchema),
    defaultValues: {
      source_layer_project_id: 0,
      area_type: "",
      source_group_by_field: [],
      column_statistics: {
        operation: "",
        field: "",
      },
      weigthed_by_intersecting_area: false,
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

    toast.info("Aggregate Polygon tool is running");
    sendAggregatePolygonRequest(getValues(), projectId)
      .then((data) =>
        data.ok
          ? toast.success("Aggregate Polygon tool is successful")
          : toast.error("Aggregate Polygon tool failed"),
      )
      .catch(() => {
        toast.error("Aggregate Polygon tool failed");
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

export default AggregatePolygon;
