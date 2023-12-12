import React from "react";
import {
  Box,
  Typography,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  useTheme,
} from "@mui/material";
import { v4 } from "uuid";
import { useProjectLayers } from "@/lib/api/projects";
import { useTranslation } from "@/i18n/client";
import { useParams } from "next/navigation";

import type { UseFormRegister } from "react-hook-form";
import type { PostAggregate } from "@/lib/validations/tools";

interface SelectAreaProps {
  register: UseFormRegister<PostAggregate>;
  watch: PostAggregate;
  // setValue: UseFormSetValue<PostAggregate>;
  // pointLayerId: string | string[];
  // area: areaSelectionTypes | undefined;
  // setArea: (value: areaSelectionTypes) => void;
  // setHexagonSize: (value: string) => void;
  // hexagonSize: string;
  // setPolygonLayer: (value: string) => void;
  // polygonLayer: string;
}

const SelectArea = (props: SelectAreaProps) => {
  const {
    register,
    watch,
    // pointLayerId,
    // area,
    // setArea,
    // setHexagonSize,
    // hexagonSize,
    // setPolygonLayer,
    // polygonLayer,
  } = props;

  const theme = useTheme();
  const { t } = useTranslation("maps");

  const { projectId } = useParams();

  const { layers: projectLayers } = useProjectLayers(
    typeof projectId === "string" ? projectId : "",
  );

  return (
    <Box>
      <Box
        display="flex"
        flexDirection="column"
        gap={theme.spacing(2)}
        marginBottom={theme.spacing(4)}
      >
        <Typography variant="body1" sx={{ color: "black" }}>
          {t("panels.tools.aggregate.select_area")}
        </Typography>
        <Typography variant="body2" sx={{ fontStyle: "italic" }}>
          {t("panels.tools.aggregate.select_area_text")}
        </Typography>
        <Box>
          <FormControl fullWidth size="small">
            <InputLabel id="demo-simple-select-label">
              {t("panels.tools.select_option")}
            </InputLabel>
            <Select
              disabled={!watch.point_layer_id.length}
              label={t("panels.tools.select_option")}
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
                }
              ].map((layer) => (
                <MenuItem value={layer.value} key={v4()}>
                  {layer.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        {watch.area_type === "h3_grid" ? (
          <Box display="flex" alignItems="center">
            <Typography variant="body1" sx={{ color: "black", flexGrow: "1" }}>
              {t("panels.tools.aggregate.hexagon_size")}
            </Typography>
            <FormControl size="small" sx={{ width: "50%" }}>
              <InputLabel id="demo-simple-select-label">
                XX {t("panels.tools.aggregate.unit")}
              </InputLabel>
              <Select
                label={`XX ${t("panels.tools.aggregate.unit")}`}
                {...register("h3_resolution")}
              >
                {["3", "4", "5", "6", "7", "8", "9", "10"].map((layer) => (
                  <MenuItem value={layer} key={v4()}>
                    {layer}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        ) : (
          <Box>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">
                {t("panels.tools.select_layer")}
              </InputLabel>
              <Select
                label={t("panels.tools.select_layer")}
                disabled={!watch.area_type}
                {...register("area_layer_id")}
              >
                {projectLayers
                  ? projectLayers.map((layer) =>
                      layer.feature_layer_geometry_type === "polygon" ? (
                        <MenuItem value={layer.layer_id} key={v4()}>
                          {layer.name}
                        </MenuItem>
                      ) : null,
                    )
                  : null}
              </Select>
            </FormControl>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SelectArea;
