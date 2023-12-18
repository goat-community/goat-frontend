import React, { useMemo } from "react";
import SelectArea from "@/components/map/panels/toolbox/tools/aggregate/SelectArea";
import Statistics from "@/components/map/panels/toolbox/tools/aggregate/Statistics";
import { Box, Button, useTheme, Typography, TextField } from "@mui/material";
import { useTranslation } from "@/i18n/client";
import { useForm } from "react-hook-form";
import { SendAggregateFeatureRequest } from "@/lib/api/tools";
import { Icon, ICON_NAME } from "@p4b/ui/components/Icon";
import { useGetUniqueLayerName } from "@/hooks/map/ToolsHooks";
import InputLayer from "@/components/map/panels/toolbox/tools/aggregate/InputLayer";

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
      point_layer_project_id: 0,
      area_type: "",
      area_group_by_field: [],
      column_statistics: {
        operation: "",
        field: "",
      },
      layer_name: "aggregate",
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
    SendAggregateFeatureRequest(getValues(), projectId);
  };

  const { uniqueName } = useGetUniqueLayerName(
    getCurrentValues.layer_name ? getCurrentValues.layer_name : "",
  );

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      sx={{ height: "100%" }}
    >
      <Box sx={{ maxHeight: "95%", overflow: "scroll" }}>
        <InputLayer
          register={register}
        />
        <SelectArea register={register} watch={getCurrentValues} />
        <Statistics
          register={register}
          setValue={setValue}
          watch={getCurrentValues}
        />
        {getCurrentValues.column_statistics.field &&
        getCurrentValues.column_statistics.operation ? (
          <Box display="flex" flexDirection="column" gap={theme.spacing(4)}>
            <Typography
              variant="body1"
              fontWeight="bold"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: theme.spacing(2),
              }}
            >
              <Icon iconName={ICON_NAME.DOWNLOAD} />
              {t("panels.tools.result")}
            </Typography>
            <Box>
              <TextField
                fullWidth
                value={uniqueName ? uniqueName : ""}
                label={t("panels.tools.output_name")}
                size="small"
                {...register("layer_name")}
              />
            </Box>
          </Box>
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
