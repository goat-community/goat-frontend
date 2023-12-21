import React from "react";
import {
  Typography,
  useTheme,
  Box,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";
import { v4 } from "uuid";
import { useTranslation } from "@/i18n/client";
import { useProjectLayers } from "@/lib/api/projects";
import { useParams } from "next/navigation";

// import type { SelectChangeEvent } from "@mui/material";
import type { UseFormSetValue, UseFormRegister } from "react-hook-form";
import type { PostJoin } from "@/lib/validations/tools";

interface PickLayerProps {
  setValue: UseFormSetValue<PostJoin>;
  watch: PostJoin;
  register: UseFormRegister<PostJoin>;
}
const InputLayer = (props: PickLayerProps) => {
  const { 
    // setValue, 
    // watch, 
    register 
  } = props;

  const theme = useTheme();
  const { t } = useTranslation("maps");

  const { projectId } = useParams();

  const { layers: projectLayers } = useProjectLayers(
    typeof projectId === "string" ? projectId : "",
  );
  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        gap={theme.spacing(2)}
        marginBottom={theme.spacing(4)}
      >
        <Typography variant="body1" sx={{ color: "black" }}>
          {t("panels.tools.join.pick_target_layer")}
        </Typography>
        <Typography variant="body2" sx={{ fontStyle: "italic" }}>
          {t("panels.tools.join.target_layer_text")}
        </Typography>
        <FormControl fullWidth size="small">
          <InputLabel id="demo-simple-select-label">
            {t("panels.tools.select_layer")}
          </InputLabel>
          <Select
            label={t("panels.tools.select_layer")}
            // value={inputValues[0]}
            // value={watch.target_layer_project_id}
            {...register("target_layer_project_id")}
            // onChange={(event: SelectChangeEvent) =>
            //   setValue("target_layer_project_id", event.target.value as number)
            // }
          >
            {projectLayers
              ? projectLayers.map((layer) => (
                  <MenuItem value={layer.id} key={v4()}>
                    {layer.name}
                  </MenuItem>
                ))
              : null}
          </Select>
        </FormControl>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        gap={theme.spacing(2)}
        marginBottom={theme.spacing(4)}
      >
        <Typography
          variant="body1"
          sx={{ color: "black", marginBottom: theme.spacing(2) }}
        >
          {t("panels.tools.join.pick_join_layer")}
        </Typography>
        <Typography variant="body2" sx={{ fontStyle: "italic" }}>
          {t("panels.tools.join.join_layer_text")}
        </Typography>
        <FormControl fullWidth size="small">
          <InputLabel id="demo-simple-select-label">
            {t("panels.tools.select_layer")}
          </InputLabel>
          <Select
            label={t("panels.tools.select_layer")}
            // value={
            //   watch.join_layer_project_id
            // }
            {...register("join_layer_project_id")}
            // onChange={(event: SelectChangeEvent) =>
            //   handleMultipleChange(event, 1)
            // }
            // onChange={(event: SelectChangeEvent) =>
            //   setValue("join_layer_project_id", event.target.value as number)
            // }
          >
            {projectLayers
              ? projectLayers.map((layer) => (
                  <MenuItem value={layer.id} key={v4()}>
                    {layer.name}
                  </MenuItem>
                ))
              : null}
          </Select>
        </FormControl>
      </Box>
    </>
  );
};

export default InputLayer;
