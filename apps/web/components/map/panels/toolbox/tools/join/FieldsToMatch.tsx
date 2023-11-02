import {
  Box,
  Typography,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  useTheme,
} from "@mui/material";
import React from "react";
import { useLayerHook } from "@/hooks/map/LayerHooks";
import { v4 } from "uuid";
import { Icon, ICON_NAME } from "@p4b/ui/components/Icon";

import type { SelectChangeEvent } from "@mui/material";

interface FieldsToMatchProps {
  setFirstField: (value: string) => void;
  firstField: string | undefined;
  setSecondField: (value: string) => void;
  secondField: string | undefined;
  firstLayerId: string;
  secondLayerId: string;
}

const FieldsToMatch = (props: FieldsToMatchProps) => {
  const {
    firstLayerId,
    secondLayerId,
    setFirstField,
    setSecondField,
    firstField,
    secondField,
  } = props;

  const theme = useTheme();

  const firstLayerKeys = useLayerHook(firstLayerId);
  const secondLayerKeys = useLayerHook(firstLayerId);

  return (
    <Box>
      <Typography variant="body1" sx={{ color: "black" }}>
        Set fields to match
      </Typography>
      <Typography variant="body2" sx={{ fontStyle: "italic" }}>
        Select the layer you want to add data
      </Typography>
      <Box
        sx={{
          backgroundColor: `${theme.palette.primary.light}14`,
          padding: `${theme.spacing(3.5)} ${theme.spacing(2)}`,
          marginTop: theme.spacing(2),
        }}
      >
        <Box>
          <Typography
            variant="body1"
            sx={{ color: "black", marginBottom: theme.spacing(2) }}
          >
            Pick a target field
          </Typography>
          <FormControl fullWidth size="small">
            <InputLabel id="demo-simple-select-label">Select Option</InputLabel>
            <Select
              disabled={!firstLayerId.length}
              label="Select Option"
              value={firstField}
              onChange={(event: SelectChangeEvent) => {
                setFirstField(event.target.value as string);
              }}
            >
              {firstLayerId.length
                ? firstLayerKeys.getLayerKeys().keys.map((key) => (
                    <MenuItem value={key.name} key={v4()}>
                      {key.name}
                    </MenuItem>
                  ))
                : null}
            </Select>
          </FormControl>
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          sx={{
            margin: `${theme.spacing(2)} 0px`,
          }}
        >
          <Icon
            iconName={ICON_NAME.REVERSE}
            htmlColor={theme.palette.primary.main}
          />
        </Box>
        <Box>
          <Typography
            variant="body1"
            sx={{ color: "black", marginBottom: theme.spacing(2) }}
          >
            Pick a target field
          </Typography>
          <FormControl fullWidth size="small">
            <InputLabel id="demo-simple-select-label">Select Option</InputLabel>
            <Select
              disabled={!secondLayerId.length}
              label="Select Option"
              value={secondField}
              onChange={(event: SelectChangeEvent) => {
                setSecondField(event.target.value as string);
              }}
            >
              {secondLayerId.length
                ? secondLayerKeys.getLayerKeys().keys.map((key) => (
                    <MenuItem value={key.name} key={v4()}>
                      {key.name}
                    </MenuItem>
                  ))
                : null}
            </Select>
          </FormControl>
        </Box>
      </Box>
    </Box>
  );
};

export default FieldsToMatch;
