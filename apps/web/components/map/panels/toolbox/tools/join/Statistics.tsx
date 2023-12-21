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
import { getLayerStringIdById } from "@/lib/utils/helpers";
import { useParams } from "next/navigation";
import { useProjectLayers } from "@/lib/api/projects";

import type { UseFormGetValues, UseFormRegister } from "react-hook-form";
import type { PostJoin } from "@/lib/validations/tools";

interface StatisticsProps {
  register: UseFormRegister<PostJoin>;
  getValues: UseFormGetValues<PostJoin>;
  watch: PostJoin;
}

const Statistics = (props: StatisticsProps) => {
  const {
    register,
    getValues,
    watch
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

  const { projectId } = useParams();

  const { layers } = useProjectLayers(projectId as string);

  const saveFieldKeys = useGetLayerKeys(
    `user_data.${getLayerStringIdById(
      layers ? layers : [],
      watch.join_layer_project_id,
    )
      .split("-")
      .join("")}`,
  );

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
            disabled={!watch.join_layer_project_id}
            label={t("panels.tools.select_method")}
            {...register("column_statistics.operation")}
          >
            {methods.map((method) => (
              <MenuItem value={method.name} key={v4()}>
                {method.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      {watch.column_statistics.operation.length ? (
        <Box sx={{ marginTop: theme.spacing(2) }}>
          <FormControl fullWidth size="small">
            <InputLabel id="demo-simple-select-label">
              {t("panels.tools.select_field")}
            </InputLabel>
            <Select
              label={t("panels.tools.select_field")}
              {...register("column_statistics.field")}
            >
              {watch.join_layer_project_id ? checkType() : null}
            </Select>
          </FormControl>
        </Box>
      ) : null}
    </Box>
  );
};

export default Statistics;
