import React from "react";
import {
  Box,
  Typography,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  useTheme,
  Stack,
  Divider,
} from "@mui/material";
import { v4 } from "uuid";
import { useProjectLayers } from "@/lib/api/projects";
import { useTranslation } from "@/i18n/client";
import { useParams } from "next/navigation";
import { Icon, ICON_NAME } from "@p4b/ui/components/Icon";

import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { PostAggregatePolygon } from "@/lib/validations/tools";

interface SelectAreaProps {
  register: UseFormRegister<PostAggregatePolygon>;
  watch: PostAggregatePolygon;
  errors: FieldErrors<PostAggregatePolygon>;
}

const SelectArea = (props: SelectAreaProps) => {
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
          iconName={ICON_NAME.CIRCLE}
          htmlColor={theme.palette.grey[700]}
          sx={{ fontSize: "18px" }}
        />
        {t("panels.tools.aggregate.select_area")}
      </Typography>
      <Stack direction="row" alignItems="center" sx={{ pl: 2 }}>
        <Box sx={{ height: "100%" }}>
          <Divider orientation="vertical" sx={{ borderRightWidth: "2px" }} />
        </Box>
        <Stack sx={{ pl: 4, py: 4, pr: 1, flexGrow: 1 }}>
          <Box
            display="flex"
            flexDirection="column"
            gap={theme.spacing(2)}
          >
            <Typography variant="body2" sx={{ fontStyle: "italic" }}>
              {t("panels.tools.aggregate.select_area_text")}
            </Typography>
            <FormControl fullWidth size="small">
              <InputLabel>
                {t("panels.tools.select_option")}
              </InputLabel>
              <Select
                disabled={!watch.source_layer_project_id}
                label={t("panels.tools.select_option")}
                error={!!errors.area_type}
                value={watch.area_type ? watch.area_type : ""}
                {...register("area_type")}
              >
                {[
                  {
                    name: t("panels.tools.aggregate.polygon_layer"),
                    value: "feature",
                  },
                  {
                    name: t("panels.tools.aggregate.hexagon_bin"),
                    value: "h3_grid",
                  },
                ].map((layer) => (
                  <MenuItem value={layer.value} key={v4()}>
                    {layer.name}
                  </MenuItem>
                ))}
              </Select>
              {!!errors.area_type && (
                <Typography sx={{ fontSize: "10px" }} color="error">
                  {errors.area_type.message}
                </Typography>
              )}
            </FormControl>
            {watch.area_type === "h3_grid" ? (
              <FormControl size="small" fullWidth>
                <InputLabel>
                  {t("panels.tools.aggregate.hexagon_size")}
                </InputLabel>
                <Select
                  label={t("panels.tools.aggregate.hexagon_size")}
                  error={!!errors.h3_resolution}
                  value={watch.h3_resolution ? watch.h3_resolution : ""}
                  {...register("h3_resolution")}
                >
                  {[3, 4, 5, 6, 7, 8, 9, 10].map((layer) => (
                    <MenuItem value={layer} key={v4()}>
                      {layer}
                    </MenuItem>
                  ))}
                </Select>
                {!!errors.h3_resolution && (
                  <Typography sx={{ fontSize: "10px" }} color="error">
                    {errors.h3_resolution.message}
                  </Typography>
                )}
              </FormControl>
            ) : (
              <FormControl fullWidth size="small">
                <InputLabel>
                  {t("panels.tools.select_layer")}
                </InputLabel>
                <Select
                  label={t("panels.tools.select_layer")}
                  disabled={!watch.area_type}
                  error={!!errors.aggregation_layer_project_id}
                  value={
                    watch.aggregation_layer_project_id
                      ? watch.aggregation_layer_project_id
                      : ""
                  }
                  {...register("aggregation_layer_project_id")}
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
                {!!errors.aggregation_layer_project_id && (
                  <Typography sx={{ fontSize: "10px" }} color="error">
                    {errors.aggregation_layer_project_id.message}
                  </Typography>
                )}
              </FormControl>
            )}
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};

export default SelectArea;
