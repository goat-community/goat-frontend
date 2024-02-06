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
  Divider,
  Stack,
} from "@mui/material";
import { useTranslation } from "@/i18n/client";
import { useGetLayerKeys } from "@/hooks/map/ToolsHooks";
import { getLayerStringIdById } from "@/lib/utils/helpers";
import { useParams } from "next/navigation";
import { useProjectLayers } from "@/lib/api/projects";
import { Icon, ICON_NAME } from "@p4b/ui/components/Icon";
import LayerFieldSelector from "@/components/common/form-inputs/LayerFieldSelector";

import type {
  UseFormGetValues,
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
  UseFormTrigger,
} from "react-hook-form";
import type { PostJoin } from "@/lib/validations/tools";

interface StatisticsProps {
  register: UseFormRegister<PostJoin>;
  getValues: UseFormGetValues<PostJoin>;
  setValue: UseFormSetValue<PostJoin>;
  watch: PostJoin;
  errors: FieldErrors<PostJoin>;
  trigger: UseFormTrigger<PostJoin>;
}

const Statistics = (props: StatisticsProps) => {
  const { register, getValues, watch, errors, setValue, trigger } = props;

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
    return saveFieldKeys.keys
      .map((key) =>
        methods
          .filter((meth) => meth.name === method)[0]
          .types.includes(key.type)
          ? key
          : null,
      )
      .filter((n) => n) as { type: "string" | "number"; name: string }[];
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing(2),
      }}
    >
      <Typography
        variant="body1"
        fontWeight="bold"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: theme.spacing(2),
        }}
      >
        <Icon
          iconName={ICON_NAME.CHART}
          htmlColor={theme.palette.grey[700]}
          sx={{ fontSize: "18px" }}
        />
        {t("panels.tools.statistics")}
      </Typography>
      <Stack direction="row" alignItems="center" sx={{ pl: 2 }}>
        <Divider orientation="vertical" sx={{ borderRightWidth: "2px" }} />
        <Stack sx={{ pl: 4, py: 4, pr: 2 }}>
          <Box>
            <Typography variant="body2" sx={{ fontStyle: "italic" }}>
              {t("panels.tools.join.statistics_text")}
            </Typography>
            <Box sx={{ marginTop: theme.spacing(2) }}>
              <FormControl fullWidth size="small">
                <InputLabel>{t("panels.tools.select_method")}</InputLabel>
                <Select
                  disabled={!watch.join_layer_project_id}
                  label={t("panels.tools.select_method")}
                  error={!!errors.column_statistics?.operation}
                  value={
                    watch.column_statistics.operation
                      ? watch.column_statistics.operation
                      : ""
                  }
                  {...register("column_statistics.operation")}
                >
                  {methods.map((method) => (
                    <MenuItem value={method.name} key={v4()}>
                      {method.name}
                    </MenuItem>
                  ))}
                </Select>
                {!!errors.column_statistics &&
                  errors.column_statistics.operation && (
                    <Typography sx={{ fontSize: "10px" }} color="error">
                      {errors.column_statistics.operation.message}
                    </Typography>
                  )}
              </FormControl>
            </Box>
            {watch.column_statistics.operation.length ? (
              <Box sx={{ mt: 2 }}>
                <LayerFieldSelector
                  label={t("panels.tools.join.join_field")}
                  selectedField={
                    checkType().filter(
                      (key) => key.name === watch.column_statistics.field,
                    )[0]
                  }
                  setSelectedField={(field: {
                    type: "string" | "number";
                    name: string;
                  }) => {
                    if (field) {
                      console.log(field);
                      setValue("column_statistics.field", field.name);
                    } else {
                      setValue("column_statistics.field", "");
                    }
                    trigger("column_statistics.field");
                  }}
                  fields={checkType()}
                />
              </Box>
            ) : null}
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Statistics;
