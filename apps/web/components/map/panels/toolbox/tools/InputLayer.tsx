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
import { useProjectLayers } from "@/hooks/map/layersHooks";
import { v4 } from "uuid";
import { useTranslation } from "@/i18n/client";

import type { SelectChangeEvent } from "@mui/material";

interface PickLayerProps {
  multiple?: boolean;
  inputValues: string | string[];
  setInputValues: (value: string | string[]) => void;
  layerTypes: string[];
}

const InputLayer = (props: PickLayerProps) => {
  const { multiple = false, inputValues, setInputValues, layerTypes } = props;

  const theme = useTheme();
  const { t } = useTranslation("maps");

  const { projectLayers } = useProjectLayers();

  const handleSingleChange = (event: SelectChangeEvent) => {
    setInputValues(event.target.value as string);
  };

  const handleMultipleChange = (event: SelectChangeEvent, inputNr: number) => {
    const multipleValues =
      typeof inputValues !== "string" ? [...inputValues] : ["", ""];
    multipleValues[inputNr] = event.target.value as string;

    setInputValues(multipleValues);
  };

  return (
    <Box>
      {multiple ? (
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
                value={inputValues[0]}
                onChange={(event: SelectChangeEvent) =>
                  handleMultipleChange(event, 0)
                }
              >
                {projectLayers.map((layer) => (
                  <MenuItem value={layer.id} key={v4()}>
                    {layer.name}
                  </MenuItem>
                ))}
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
                value={inputValues[1]}
                onChange={(event: SelectChangeEvent) =>
                  handleMultipleChange(event, 1)
                }
              >
                {projectLayers.map((layer) => (
                  <MenuItem value={layer.id} key={v4()}>
                    {layer.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </>
      ) : (
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
              value={inputValues}
              onChange={handleSingleChange}
            >
              {projectLayers.map((layer) =>
                layerTypes.includes(layer.feature_layer_geometry_type) ? (
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
  );
};

export default InputLayer;
