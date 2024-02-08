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

import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { PostAggregatePolygon } from "@/lib/validations/tools";

interface PickLayerProps {
  register: UseFormRegister<PostAggregatePolygon>;
  watch: PostAggregatePolygon;
  errors: FieldErrors<PostAggregatePolygon>;
}
const InputLayer = (props: PickLayerProps) => {
  const { register, watch, errors } = props;

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
        {t("panels.tools.aggregate.pick_layer")}
      </Typography>
      <Stack direction="row" alignItems="center" sx={{ pl: 2 }}>
        <Box sx={{ height: "100%" }}>
          <Divider orientation="vertical" sx={{ borderRightWidth: "2px" }} />
        </Box>
        <Stack sx={{ px: 3, py: 4, flexGrow: 1 }}>
          <Box display="flex" flexDirection="column" gap={theme.spacing(3)}>
            <Typography variant="body2" sx={{ fontStyle: "italic" }}>
              {t("panels.tools.aggregate.pick_layer_text")}
            </Typography>
            <FormControl fullWidth size="small">
              <InputLabel>{t("panels.tools.select_layer")}</InputLabel>
              <Select
                label={t("panels.tools.select_layer")}
                error={!!errors.source_layer_project_id}
                value={
                  watch.source_layer_project_id
                    ? watch.source_layer_project_id
                    : ""
                }
                {...register("source_layer_project_id")}
              >
                {projectLayers
                  ? projectLayers.map((layer) =>
                      ["polygon"].includes(
                        layer.feature_layer_geometry_type
                          ? layer.feature_layer_geometry_type
                          : "",
                      ) ? (
                        <MenuItem value={layer.id} key={v4()}>
                          {layer.name}
                        </MenuItem>
                      ) : null,
                    )
                  : null}
              </Select>
              {!!errors.source_layer_project_id && (
                <Typography sx={{ fontSize: "10px" }} color="error">
                  {errors.source_layer_project_id.message}
                </Typography>
              )}
            </FormControl>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};

export default InputLayer;
