import React, { useMemo } from "react";
import FieldsToMatch from "@/components/map/panels/toolbox/tools/join/FieldsToMatch";
import Statistics from "@/components/map/panels/toolbox/tools/join/Statistics";
import { useTheme, Box, Button } from "@mui/material";
import { sendJoinFeatureRequest } from "@/lib/api/tools";
import { useTranslation } from "@/i18n/client";
import { useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import InputLayer from "@/components/map/panels/toolbox/tools/join/InputLayer";
import { zodResolver } from "@hookform/resolvers/zod";
import { joinBaseSchema } from "@/lib/validations/tools";

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
    sendJoinFeatureRequest(getValues(), projectId as string);
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
              !getCurrentValues.join_layer_project_id &&
              !getCurrentValues.join_field &&
              !getCurrentValues.column_statistics.operation &&
              !getCurrentValues.column_statistics.field &&
              !getCurrentValues.target_layer_project_id &&
              !getCurrentValues.target_field
            }
          >
            {t("panels.tools.reset")}
          </Button>
          <Button
            sx={{ flexGrow: "1" }}
            onClick={handleRun}
            disabled={!isValid}
          >
            {t("panels.tools.run")}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Join;
