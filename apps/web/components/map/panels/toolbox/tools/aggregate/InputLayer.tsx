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
import type { UseFormRegister } from "react-hook-form";
import type { PostAggregate } from "@/lib/validations/tools";

interface PickLayerProps {
  register: UseFormRegister<PostAggregate>;
}
const InputLayer = (props: PickLayerProps) => {
  const {
    register,
  } = props;

  const theme = useTheme();
  const { t } = useTranslation("maps");

  const { projectId } = useParams();

  const { layers: projectLayers } = useProjectLayers(
    typeof projectId === "string" ? projectId : "",
  );
  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={theme.spacing(2)}
      marginBottom={theme.spacing(4)}
    >
      <Typography variant="body1" sx={{ color: "black" }}>
        {t("panels.tools.aggregate.pick_layer")}
      </Typography>
      <Typography variant="body2" sx={{ fontStyle: "italic" }}>
        {t("panels.tools.aggregate.pick_layer_text")}
      </Typography>
      <FormControl fullWidth size="small">
        <InputLabel id="demo-simple-select-label">
          {" "}
          {t("panels.tools.select_layer")}
        </InputLabel>
        <Select
          label={t("panels.tools.select_layer")}
          {...register("point_layer_project_id")}
        >
          {projectLayers
            ? projectLayers.map((layer) =>
                ["point"].includes(layer.feature_layer_geometry_type) ? (
                  <MenuItem value={layer.layer_id} key={v4()}>
                    {layer.name}
                  </MenuItem>
                ) : null,
              )
            : null}
        </Select>
      </FormControl>
    </Box>
  );
};

export default InputLayer;
