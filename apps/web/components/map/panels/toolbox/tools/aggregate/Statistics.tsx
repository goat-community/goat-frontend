import React from "react";
import {
  Box,
  Typography,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  useTheme,
  ListItemText,
  Checkbox,
} from "@mui/material";
import { v4 } from "uuid";
import { useTranslation } from "@/i18n/client";

import type { SelectChangeEvent } from "@mui/material";
import type { ColumStatisticsOperation } from "@/types/map/toolbox";

interface StatisticsProps {
  pointLayerId: string | string[];
  field: string;
  setFieldSelected: (value: string) => void;
  method: ColumStatisticsOperation | undefined;
  setMethod: (value: ColumStatisticsOperation) => void;
  setGroupedFields: (value: string[]) => void;
  groupedFields: string[] | undefined;
  setOutputName: (value: string) => void;
}

const Statistics = (props: StatisticsProps) => {
  const {
    pointLayerId,
    field,
    setFieldSelected,
    method,
    setMethod,
    groupedFields,
    setGroupedFields,
    setOutputName,
  } = props;

  const theme = useTheme();
  const { t } = useTranslation("maps");

  const methodsKeys = [
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

  const pointLayerKeys = useLayerHook(
    typeof pointLayerId === "string" ? pointLayerId : "",
  );

  function checkType() {
      return methodsKeys.map((key) =>
        key.types.includes(
          pointLayerKeys
            .getLayerKeys()
            .keys.filter((layerKey) => layerKey.name === field)[0].type,
        ) ? (
          <MenuItem value={key.name} key={v4()}>
            {key.name}
          </MenuItem>
        ) : null,
      );
  }

  return (
    <Box>
      <Box
        display="flex"
        flexDirection="column"
        gap={theme.spacing(2)}
        marginBottom={theme.spacing(4)}
      >
        <Typography variant="body1" sx={{ color: "black" }}>
          {t("panels.tools.statistics")}
        </Typography>
        <Typography variant="body2" sx={{ fontStyle: "italic" }}>
          {t("panels.tools.aggregate.statistics_text")}
        </Typography>
        <Typography variant="body1" sx={{ color: "black" }}>
          {t("panels.tools.aggregate.field")}
        </Typography>
        <Box>
          <FormControl fullWidth size="small">
            <InputLabel id="demo-simple-select-label">
              {t("panels.tools.select_field")}
            </InputLabel>
            <Select
              disabled={!pointLayerId.length}
              label={t("panels.tools.select_field")}
              value={field}
              onChange={(event: SelectChangeEvent) =>
                setFieldSelected(event.target.value as string)
              }
            >
              {pointLayerKeys.getLayerKeys().keys.map((key) => (
                <MenuItem value={key.name} key={v4()}>
                  {key.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box>
          <FormControl fullWidth size="small">
            <InputLabel id="demo-simple-select-label">
              {t("panels.tools.select_method")}
            </InputLabel>
            <Select
              disabled={!field.length}
              label={t("panels.tools.select_method")}
              value={method}
              onChange={(event: SelectChangeEvent) => {
                setMethod(event.target.value as ColumStatisticsOperation);
                setOutputName(
                  `${field}_${event.target.value as ColumStatisticsOperation}`,
                );
              }}
            >
              {field ? checkType() : null}
            </Select>
          </FormControl>
        </Box>
        <Typography variant="body1" sx={{ color: "black" }}>
          {t("panels.tools.aggregate.field_group")}
        </Typography>
        <Typography variant="body2" sx={{ fontStyle: "italic" }}>
          {t("panels.tools.aggregate.field_group_text")}
        </Typography>
        <Box>
          <FormControl fullWidth size="small">
            <InputLabel id="demo-multiple-checkbox-label">
              {t("panels.tools.select_field")}
            </InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              disabled={!pointLayerId.length}
              multiple
              label={t("panels.tools.select_field")}
              value={groupedFields ? groupedFields : []}
              renderValue={(selected) => (selected ? selected.join(", ") : "")}
              onChange={(event: SelectChangeEvent<typeof groupedFields>) =>
                setGroupedFields(event.target.value as string[])
              }
            >
              {pointLayerKeys.getLayerKeys().keys.map((key) => (
                <MenuItem value={key.name} key={v4()}>
                  <Checkbox
                    checked={
                      groupedFields && groupedFields.indexOf(key.name) > -1
                    }
                  />
                  <ListItemText primary={key.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
    </Box>
  );
};

export default Statistics;
