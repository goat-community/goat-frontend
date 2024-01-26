import React, { useMemo } from "react";
import { BufferBaseSchema } from "@/lib/validations/tools";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, useTheme, Button } from "@mui/material";
import { useTranslation } from "@/i18n/client";
import { sendBufferRequest } from "@/lib/api/tools";
import { useParams } from "next/navigation";

import InputLayer from "@/components/map/panels/toolbox/tools/buffer/InputLayer";
import BufferSettings from "@/components/map/panels/toolbox/tools/buffer/BufferSettings";

import type { PostBuffer } from "@/lib/validations/tools";

const Buffer = () => {
  const {
    register,
    reset,
    watch,
    getValues,
    setValue,
    formState: { errors, isValid },
  } = useForm<PostBuffer>({
    mode: "onChange",
    resolver: zodResolver(BufferBaseSchema),
    defaultValues: {
      source_layer_project_id: 0,
      max_distance: 500,
      distance_step: 50,
      polygon_union: true,
      polygon_difference: false,
      // source_layer_project_id: 0,
      // area_type: "",
      // source_group_by_field: [],
      // column_statistics: {
      //   operation: "",
      //   field: "",
      // },
      // weigthed_by_intersecting_area: false,
    },
  });

  const theme = useTheme();
  const { t } = useTranslation("maps");
  const { projectId } = useParams();

  const handleReset = () => {
    reset();
  };

  const handleRun = () => {
    console.log(getValues());
    sendBufferRequest(getValues(), projectId as string);
  };

  const watchFormValues = watch();

  const getCurrentValues = useMemo(() => {
    return watchFormValues;
  }, [watchFormValues]);

  console.log(isValid, errors)

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
        <BufferSettings
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
              !getCurrentValues.max_distance &&
              !getCurrentValues.distance_step &&
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

export default Buffer;
