import React, { useMemo } from "react";
import InputLayer from "@/components/map/panels/toolbox/tools/InputLayer";
import SelectArea from "@/components/map/panels/toolbox/tools/aggregate/SelectArea";
import Statistics from "@/components/map/panels/toolbox/tools/aggregate/Statistics";
import SaveResult from "@/components/map/panels/toolbox/tools/SaveResult";
import { Box, Button, useTheme } from "@mui/material";
import { useTranslation } from "@/i18n/client";
import { useForm } from "react-hook-form";
import { SendAggregateFeatureRequest } from "@/lib/api/tools";

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
    // formState: { errors },
  } = useForm<PostAggregate>({
    defaultValues: {
      point_layer_id: "",
      area_type: "",
      area_group_by_field: [],
      column_statistics: {
        operation: "",
        field: "",
      },
      result_target: {
        layer_name: "aggregate",
        folder_id: "",
        project_id: projectId as string,
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
    console.log(getValues());
    SendAggregateFeatureRequest(getValues());
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      sx={{ height: "100%" }}
    >
      <Box sx={{ maxHeight: "95%", overflow: "scroll" }}>
        <InputLayer
          watch={getCurrentValues}
          setValue={setValue}
          layerTypes={["point"]}
        />
        <SelectArea register={register} watch={getCurrentValues} />
        <Statistics
          register={register}
          setValue={setValue}
          watch={getCurrentValues}
        />
        {getCurrentValues.column_statistics.field &&
        getCurrentValues.column_statistics.operation ? (
          <SaveResult register={register} watch={getCurrentValues} />
        ) : null}
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: theme.spacing(2),
          alignItems: "center",
        }}
      >
        <Button variant="outlined" sx={{ flexGrow: "1" }} onClick={handleReset}>
          {t("panels.tools.reset")}
        </Button>
        <Button sx={{ flexGrow: "1" }} onClick={handleRun}>
          {t("panels.tools.run")}
        </Button>
      </Box>
    </Box>
  );
};

export default Aggregate;
