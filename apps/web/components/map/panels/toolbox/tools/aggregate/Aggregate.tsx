import React, { useMemo } from "react";
import SelectArea from "@/components/map/panels/toolbox/tools/aggregate/SelectArea";
import Statistics from "@/components/map/panels/toolbox/tools/aggregate/Statistics";
import { Box, Button, useTheme } from "@mui/material";
import { useTranslation } from "@/i18n/client";
import { useForm } from "react-hook-form";
import { sendAggregateFeatureRequest } from "@/lib/api/tools";
import InputLayer from "@/components/map/panels/toolbox/tools/aggregate/InputLayer";
import { zodResolver } from "@hookform/resolvers/zod";
import { AggregateBaseSchema } from "@/lib/validations/tools";

import type { PostAggregate } from "@/lib/validations/tools";

interface AggregateProps {
  projectId: string;
}

const Aggregate = (props: AggregateProps) => {
  const { projectId } = props;

  const { t } = useTranslation("maps");

  const theme = useTheme();

  const {
    register,
    reset,
    watch,
    getValues,
    setValue,
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
    sendAggregateFeatureRequest(getValues(), projectId);
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
        />
      </Box>
      <Box
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
              !getCurrentValues.aggregation_layer_project_id &&
              !getCurrentValues.area_type &&
              !getCurrentValues.column_statistics.operation &&
              !getCurrentValues.column_statistics.field &&
              !getCurrentValues.h3_resolution &&
              !getCurrentValues.source_group_by_field.length &&
              !getCurrentValues.source_layer_project_id
            }
          >
            {t("panels.tools.reset")}
          </Button>
          <Button
            sx={{ flexGrow: "1" }}
            disabled={!isValid}
            onClick={handleRun}
          >
            {t("panels.tools.run")}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Aggregate;
