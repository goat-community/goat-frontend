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
} from "@mui/material";
import { useTranslation } from "@/i18n/client";
import { useGetLayerKeys } from "@/hooks/map/ToolsHooks";

import type { UseFormGetValues, UseFormRegister } from "react-hook-form";
import type { PostJoin } from "@/lib/validations/tools";

interface StatisticsProps {
  register: UseFormRegister<PostJoin>;
  getValues: UseFormGetValues<PostJoin>;
  // secondLayerId: string;
  // secondField: string | undefined;
  // setMethod: (value: ColumStatisticsOperation | undefined) => void;
  // method: ColumStatisticsOperation | undefined;
  // setStatisticField: (value: string) => void;
  // statisticField: string | undefined;
}

const Statistics = (props: StatisticsProps) => {
  const {
    register,
    getValues,
    // secondLayerId,
    // secondField,
    // setMethod,
    // method,
    // setStatisticField,
    // statisticField
  } = props;

  const theme = useTheme();
  const { t } = useTranslation("maps");
  const method = getValues("column_statistics.operation");

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

  const saveFieldKeys = useGetLayerKeys(`user_data.${getValues("join_layer_id").split("-").join("")}`);

  function checkType() {
    return saveFieldKeys.keys.map((key) =>
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
        {t("panels.tools.statistics")}
      </Typography>
      <Typography variant="body2" sx={{ fontStyle: "italic" }}>
        {t("panels.tools.join.statistics_text")}
      </Typography>
      <Box sx={{ marginTop: theme.spacing(2) }}>
        <FormControl fullWidth size="small">
          <InputLabel id="demo-simple-select-label">
            {t("panels.tools.select_method")}
          </InputLabel>
          <Select
            disabled={!getValues("join_layer_id")}
            label={t("panels.tools.select_method")}
            {...register("column_statistics.operation")}
            // value={method ? method : ""}
            // onChange={(event: SelectChangeEvent) => {
            //   setMethod(event.target.value as ColumStatisticsOperation);
            // }}
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
            <InputLabel id="demo-simple-select-label">
              {t("panels.tools.select_field")}
            </InputLabel>
            <Select
              label={t("panels.tools.select_field")}
              // value={statisticField}
              // onChange={(event: SelectChangeEvent) => {
              //   setStatisticField(event.target.value as string);
              // }}
              {...register("column_statistics.field")}
            >
              {register("join_layer_id").length ? checkType() : null}
            </Select>
          </FormControl>
        </Box>
      ) : null}
    </Box>
  );
};

export default Statistics;
