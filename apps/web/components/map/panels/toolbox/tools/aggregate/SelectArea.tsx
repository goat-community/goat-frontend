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
import { useTranslation } from "@/i18n/client";

import type { SelectChangeEvent } from "@mui/material";
import type { areaSelectionTypes } from "@/types/map/toolbox";

interface SelectAreaProps {
  pointLayerId: string | string[];
  area: areaSelectionTypes | undefined;
  setArea: (value: areaSelectionTypes) => void;
  setHexagonSize: (value: string) => void;
  hexagonSize: string;
  setPolygonLayer: (value: string) => void;
  polygonLayer: string;
}

const SelectArea = (props: SelectAreaProps) => {
  const {
    pointLayerId,
    area,
    setArea,
    setHexagonSize,
    hexagonSize,
    setPolygonLayer,
    polygonLayer,
  } = props;

  const theme = useTheme();
  const { t } = useTranslation("maps");


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
              disabled={!pointLayerId.length}
              label={t("panels.tools.select_option")}
              value={area}
              onChange={(event: SelectChangeEvent) =>
                setArea(event.target.value as areaSelectionTypes)
              }
            >
              {[
                t("panels.tools.aggregate.hexagon_bin"),
                t("panels.tools.aggregate.polygon_layer"),
              ].map((layer) => (
                <MenuItem value={layer} key={v4()}>
                  {layer}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        {area === t("panels.tools.aggregate.hexagon_bin") ? (
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
                value={hexagonSize}
                onChange={(event: SelectChangeEvent) =>
                  setHexagonSize(event.target.value as areaSelectionTypes)
                }
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
                disabled={!area}
                value={polygonLayer}
                onChange={(event: SelectChangeEvent) =>
                  setPolygonLayer(event.target.value as areaSelectionTypes)
                }
              >
                {projectLayers.map((layer) =>
                  layer.feature_layer_geometry_type === "polygon" ? (
                    <MenuItem value={layer.id} key={v4()}>
                      {layer.name}
                    </MenuItem>
                  ) : null,
                )}
              </Select>
            </FormControl>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SelectArea;
