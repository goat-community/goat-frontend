import React, { useMemo } from "react";
// import InputLayer from "@/components/map/panels/toolbox/tools/InputLayer";
import FieldsToMatch from "@/components/map/panels/toolbox/tools/join/FieldsToMatch";
import Statistics from "@/components/map/panels/toolbox/tools/join/Statistics";
import { Divider, useTheme, Box, Button, Typography, TextField } from "@mui/material";
import { SendJoinFeatureRequest } from "@/lib/api/tools";
import { useTranslation } from "@/i18n/client";
import { useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import { Icon, ICON_NAME } from "@p4b/ui/components/Icon";
import { useGetUniqueLayerName } from "@/hooks/map/ToolsHooks";
import InputLayer from "@/components/map/panels/toolbox/tools/join/InputLayer";

import type { PostJoin } from "@/lib/validations/tools";

const Join = () => {
  const theme = useTheme();
  const { t } = useTranslation("maps");

  const { projectId } = useParams();

  const {
    register,
    reset,
    watch,
    getValues,
    setValue,
    // formState: { errors },
  } = useForm<PostJoin>({
    defaultValues: {
      target_layer_project_id: 0,
      target_field: "",
      join_layer_project_id: 0,
      join_field: "",
      column_statistics: {
        operation: "",
        field: "",
      },
      layer_name: "join",
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
    SendJoinFeatureRequest(getValues(), projectId as string);
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
          watch={getCurrentValues}
          setValue={setValue}
          register={register}
        />
        <Divider
          sx={{
            margin: `${theme.spacing(4)} 0px`,
            backgroundColor: `${theme.palette.primary.main}40`,
          }}
        />
        <FieldsToMatch register={register} watch={getCurrentValues} />
        <Statistics
          register={register}
          getValues={getValues}
          watch={getCurrentValues}
        />

        {getCurrentValues.join_layer_project_id &&
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
        ) : // <SaveResult register={register} watch={getCurrentValues} />
        null}
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

export default Join;
