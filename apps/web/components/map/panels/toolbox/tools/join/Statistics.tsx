import React from "react";
import { v4 } from "uuid";
import {
  Box,
  useTheme,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { useLayerHook } from "@/hooks/map/LayerHooks";

type ColumStatisticsOperation =
  | "count"
  | "sum"
  | "mean"
  | "median"
  | "min"
  | "max";

interface StatisticsProps {
  secondLayerId: string;
  secondField: string | undefined;
  setMethod: (value: ColumStatisticsOperation | undefined) => void;
  method: ColumStatisticsOperation | undefined;
  setStatisticField: (value: string) => void;
  statisticField: string | undefined;
  setLabel: (value: string) => void;
  label: string | undefined;
}

const Statistics = (props: StatisticsProps) => {
  const {
    secondLayerId,
    secondField,
    setMethod,
    method,
    setStatisticField,
    statisticField,
    setLabel,
    label,
  } = props;

  const theme = useTheme();

  const methods = [
    {
      name: "count",
      types: ["string", "number"],
    },
    {
      name: "sum",
      types: ["number"],
    },
    {
      name: "mean",
      types: ["number"],
    },
    {
      name: "median",
      types: ["number"],
    },
    {
      name: "min",
      types: ["number"],
    },
    {
      name: "max",
      types: ["number"],
    },
  ];

  const saveFieldKeys = useLayerHook(secondLayerId);

  function checkType() {
    return saveFieldKeys.getLayerKeys().keys.map((key) =>
      methods
        .filter((meth) => meth.name === method)[0]
        .types.includes(key.type) ? (
        <MenuItem value={key.name} key={v4()}>
          {key.name}
        </MenuItem>
      ) : null,
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: `${theme.palette.primary.light}14`,
        padding: `${theme.spacing(3.5)} ${theme.spacing(2)}`,
      }}
    >
      <Typography variant="body1" sx={{ color: "black" }}>
        Statistics
      </Typography>
      <Typography variant="body2" sx={{ fontStyle: "italic" }}>
        Select the method used to join the data
      </Typography>
      <Box sx={{ marginTop: theme.spacing(2) }}>
        <FormControl fullWidth size="small">
          <InputLabel id="demo-simple-select-label">Select Option</InputLabel>
          <Select
            disabled={!secondField}
            label="Select Option"
            value={method ? method : ""}
            onChange={(event: SelectChangeEvent) => {
              setMethod(event.target.value as ColumStatisticsOperation);
            }}
          >
            {methods.map((method) => (
              <MenuItem value={method.name} key={v4()}>
                {method.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      {method ? (
        <Box sx={{ marginTop: theme.spacing(2) }}>
          <FormControl fullWidth size="small">
            <InputLabel id="demo-simple-select-label">Select Option</InputLabel>
            <Select
              label="Select Option"
              value={statisticField}
              onChange={(event: SelectChangeEvent) => {
                setStatisticField(event.target.value as string);
              }}
            >
              {secondLayerId.length ? checkType() : null}
            </Select>
          </FormControl>
        </Box>
      ) : null}
      {statisticField ? (
        <Box sx={{ marginTop: theme.spacing(2) }}>
          <TextField
            fullWidth
            value={label ? label : ""}
            label="Label"
            size="small"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setLabel(event.target.value as string)
            }
          />
        </Box>
      ) : null}
    </Box>
  );
};

export default Statistics;
