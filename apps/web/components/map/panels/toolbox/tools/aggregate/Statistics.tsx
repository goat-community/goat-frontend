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
import { useGetLayerKeys } from "@/hooks/map/ToolsHooks";

import type { SelectChangeEvent } from "@mui/material";
import type { UseFormRegister, UseFormSetValue } from "react-hook-form";
import type { PostAggregate } from "@/lib/validations/tools";

interface StatisticsProps {
  register: UseFormRegister<PostAggregate>;
  setValue: UseFormSetValue<PostAggregate>;
  watch: PostAggregate;
}

const Statistics = (props: StatisticsProps) => {
  const {
    register,
    setValue,
    watch,
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

  const pointLayerKeys = useGetLayerKeys(
    `user_data.${watch.point_layer_id.split("-").join("")}`,
  );

  function checkType() {
    return methodsKeys.map((key) =>
      key.types.includes(
        pointLayerKeys.keys.filter((layerKey) => layerKey.name === watch.column_statistics.field)[0]
          .type,
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
              disabled={!watch.point_layer_id.length}
              label={t("panels.tools.select_field")}
              {...register("column_statistics.field")}
            >
              {pointLayerKeys.keys.map((key) => (
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
              disabled={!watch.column_statistics.field}
              label={t("panels.tools.select_method")}
              {...register("column_statistics.operation")}
            >
              {watch.column_statistics.field ? checkType() : null}
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
              disabled={!watch.point_layer_id.length}
              multiple
              label={t("panels.tools.select_field")}
              // {...register("area_group_by_field")}
              value={watch.area_group_by_field}
              renderValue={(selected) => (selected ? selected.join(", ") : "")}
              // value={}
              onChange={(
                event: SelectChangeEvent<typeof watch.area_group_by_field>,
              ) =>{
                setValue("area_group_by_field", event.target.value as string[])

              }
              }
            >
              {pointLayerKeys.keys.map((key) => (
                <MenuItem value={key.name} key={v4()}>
                  <Checkbox
                    checked={
                      watch.area_group_by_field &&
                      watch.area_group_by_field.indexOf(key.name) > -1
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
