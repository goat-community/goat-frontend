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

import type { SelectChangeEvent } from "@mui/material";

interface PickLayerProps {
  multiple?: boolean;
  inputValues: string | string[];
  setInputValues: (value: string | string[]) => void;
}

const InputLayer = (props: PickLayerProps) => {
  const { multiple = false, inputValues, setInputValues } = props;

  const theme = useTheme();

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
              Pick a target layer
            </Typography>
            <Typography variant="body2" sx={{ fontStyle: "italic" }}>
              Select the layer you want to add data
            </Typography>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">
                Select Option
              </InputLabel>
              <Select
                label="Select Option"
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
              Pick layer to join
            </Typography>
            <Typography variant="body2" sx={{ fontStyle: "italic" }}>
              Select the layer containing the data of interest
            </Typography>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">
                Select Option
              </InputLabel>
              <Select
                label="Select Option"
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
            Pick a layer
          </Typography>
          <Typography variant="body2" sx={{ fontStyle: "italic" }}>
            Select the layer you want to add data
          </Typography>
          <FormControl fullWidth size="small">
            <InputLabel id="demo-simple-select-label">Age</InputLabel>
            <Select
              label="age"
              value={inputValues}
              onChange={handleSingleChange}
            >
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </FormControl>
        </Box>
      )}
    </Box>
  );
};

export default InputLayer;
