import React from "react";
import {
  Typography,
  useTheme,
  Box,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Stack,
  Divider,
} from "@mui/material";
import { v4 } from "uuid";
import { useTranslation } from "@/i18n/client";
import { useProjectLayers } from "@/lib/api/projects";
import { useParams } from "next/navigation";
import { Icon, ICON_NAME } from "@p4b/ui/components/Icon";

import type {
  UseFormSetValue,
  UseFormRegister,
  FieldErrors,
} from "react-hook-form";
import type { PostOriginDestination } from "@/lib/validations/tools";

interface PickLayerProps {
  setValue: UseFormSetValue<PostOriginDestination>;
  watch: PostOriginDestination;
  register: UseFormRegister<PostOriginDestination>;
  errors: FieldErrors<PostOriginDestination>;
}
const InputLayer = (props: PickLayerProps) => {
  const {
    // setValue,
    watch,
    register,
    errors,
  } = props;

  const theme = useTheme();
  const { t } = useTranslation("maps");

  const { projectId } = useParams();

  const { layers: projectLayers } = useProjectLayers(
    typeof projectId === "string" ? projectId : "",
  );
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing(2),
      }}
    >
      <Typography
        variant="body1"
        fontWeight="bold"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: theme.spacing(2),
        }}
      >
        <Icon
          iconName={ICON_NAME.LAYERS}
          htmlColor={theme.palette.grey[700]}
          sx={{ fontSize: "18px" }}
        />
        {t("tools.panels.buffer.pick_layer")}
      </Typography>
      <Stack direction="row" alignItems="center" sx={{ pl: 2, mb: 4 }}>
        <Box sx={{ height: "100%" }}>
          <Divider orientation="vertical" sx={{ borderRightWidth: "2px" }} />
        </Box>
        <Stack sx={{ pl: 4, py: 4, pr: 1 }}>
          <Box>
            <Box
              display="flex"
              flexDirection="column"
              gap={theme.spacing(2)}
              marginBottom={theme.spacing(4)}
            >
              <Typography
                variant="body2"
                sx={{ fontStyle: "italic", marginBottom: theme.spacing(2) }}
              >
                {t("panels.tools.join.target_layer_text")}
              </Typography>
              <FormControl fullWidth size="small">
                <InputLabel>{t("tools.panels.origin_destination.geometry_layer")}</InputLabel>
                <Select
                  label={t("tools.panels.origin_destination.geometry_layer")}
                  error={!!errors.geometry_layer_project_id}
                  value={
                    watch.geometry_layer_project_id
                      ? watch.geometry_layer_project_id
                      : ""
                  }
                  {...register("geometry_layer_project_id")}
                >
                  {projectLayers
                    ? projectLayers.map((layer) =>
                        layer.feature_layer_geometry_type === "polygon" ? (
                          <MenuItem value={layer.id} key={v4()}>
                            {layer.name}
                          </MenuItem>
                        ) : null,
                      )
                    : null}
                </Select>
                {!!errors.geometry_layer_project_id && (
                  <Typography sx={{ fontSize: "10px" }} color="error">
                    {errors.geometry_layer_project_id.message}
                  </Typography>
                )}
              </FormControl>
            </Box>
            <Box display="flex" flexDirection="column" gap={theme.spacing(2)}>
              <FormControl fullWidth size="small">
                <InputLabel>{t("tools.panels.origin_destination.matrix_layer")}</InputLabel>
                <Select
                  label={t("tools.panels.origin_destination.matrix_layer")}
                  error={!!errors.origin_destination_matrix_layer_project_id}
                  value={
                    watch.origin_destination_matrix_layer_project_id
                      ? watch.origin_destination_matrix_layer_project_id
                      : ""
                  }
                  {...register("origin_destination_matrix_layer_project_id")}
                >
                  {projectLayers
                    ? projectLayers.map((layer) =>
                        layer.type === "table" ? (
                          <MenuItem value={layer.id} key={v4()}>
                            {layer.name}
                          </MenuItem>
                        ) : null,
                      )
                    : null}
                </Select>
                {!!errors.origin_destination_matrix_layer_project_id && (
                  <Typography sx={{ fontSize: "10px" }} color="error">
                    {errors.origin_destination_matrix_layer_project_id.message}
                  </Typography>
                )}
              </FormControl>
            </Box>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};

export default InputLayer;
