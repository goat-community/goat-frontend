import React, { useMemo } from "react";
import { Box, Button, useTheme } from "@mui/material";
import { useTranslation } from "@/i18n/client";
import { originDestinationBaseSchema } from "@/lib/validations/tools";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
// import { useParams } from "next/navigation";
import InputLayer from "@/components/map/panels/toolbox/tools/originDestination/InputLayer";
import ODSettings from "@/components/map/panels/toolbox/tools/originDestination/ODSettings";

import type { PostOriginDestination } from "@/lib/validations/tools";

const OriginDestination = () => {
  const theme = useTheme();
  const { t } = useTranslation("maps");
  // const {projectId} = useParams();

  const {
    register,
    reset,
    watch,
    // getValues,
    setValue,
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
    // sendJoinFeatureRequest(getValues(), projectId as string);
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
              !getCurrentValues.geometry_layer_project_id &&
              !getCurrentValues.destination_column &&
              !getCurrentValues.origin_column &&
              !getCurrentValues.origin_destination_matrix_layer_project_id &&
              !getCurrentValues.unique_id_column &&
              !getCurrentValues.weight_column
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

export default OriginDestination;
