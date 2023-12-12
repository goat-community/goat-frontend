import React, { useMemo } from "react";
import InputLayer from "@/components/map/panels/toolbox/tools/InputLayer";
import FieldsToMatch from "@/components/map/panels/toolbox/tools/join/FieldsToMatch";
import Statistics from "@/components/map/panels/toolbox/tools/join/Statistics";
import { Divider, useTheme, Box, Button } from "@mui/material";
// import { SendJoinFeatureRequest } from "@/lib/api/tools";
import { useTranslation } from "@/i18n/client";
import SaveResult from "@/components/map/panels/toolbox/tools/SaveResult";
import { useForm } from "react-hook-form";
import { SendJoinFeatureRequest } from "@/lib/api/tools";
import { useParams } from "next/navigation";

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
      target_layer_id: "",
      target_field: "",
      join_layer_id: "",
      join_field: "",
      column_statistics: {
        operation: "",
        field: "",
      },
      result_target: {
        layer_name: "join",
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
    SendJoinFeatureRequest(getValues());
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
          multiple
        />
        <Divider
          sx={{
            margin: `${theme.spacing(4)} 0px`,
            backgroundColor: `${theme.palette.primary.main}40`,
          }}
        />
        <FieldsToMatch register={register} getValues={getValues} />
        <Statistics
          register={register}
          getValues={getValues}
          watch={getCurrentValues}
        />
        {getValues("join_layer_id") &&
        getValues("column_statistics.operation") ? (
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

export default Join;
