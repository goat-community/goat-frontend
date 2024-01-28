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
  Stack,
  Divider,
  Switch,
} from "@mui/material";
import { v4 } from "uuid";
import { useTranslation } from "@/i18n/client";
import { useGetLayerKeys } from "@/hooks/map/ToolsHooks";
import { useProjectLayers } from "@/lib/api/projects";
import { getLayerStringIdById } from "@/lib/utils/helpers";
import { useParams } from "next/navigation";
import { Icon, ICON_NAME } from "@p4b/ui/components/Icon";
import LayerFieldSelector, {
  FieldTypeColors,
  FieldTypeTag,
} from "@/components/common/form-inputs/LayerFieldSelector";

import type {
  UseFormRegister,
  UseFormSetValue,
  FieldErrors,
} from "react-hook-form";
import type { PostAggregatePolygon } from "@/lib/validations/tools";

interface StatisticsProps {
  register: UseFormRegister<PostAggregatePolygon>;
  setValue: UseFormSetValue<PostAggregatePolygon>;
  watch: PostAggregatePolygon;
  errors: FieldErrors<PostAggregatePolygon>;
}

const Statistics = (props: StatisticsProps) => {
  const { register, setValue, watch, errors } = props;

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

  const { projectId } = useParams();

  const { layers } = useProjectLayers(projectId as string);

  const pointLayerKeys = useGetLayerKeys(
    `user_data.${getLayerStringIdById(
      layers ? layers : [],
      watch.source_layer_project_id,
    )
      .split("-")
      .join("")}`,
  );

  const selectAreaLayerKeys = useGetLayerKeys(
    `user_data.${getLayerStringIdById(
      layers ? layers : [],
      "aggregation_layer_project_id" in watch && watch.aggregation_layer_project_id
        ? watch.aggregation_layer_project_id
        : 0,
    )
      .split("-")
      .join("")}`,
  );

  const hexagonKeys = {
    keys: [{ name: "Area in m²", type: "string", value: "$area" }],
  };

  const keysToSelect =
    watch.area_type === "feature" ? selectAreaLayerKeys.keys : hexagonKeys.keys;

  function checkType() {
    return methodsKeys.map((key) =>
      key.types.includes(
        keysToSelect.filter(
          (layerKey) => layerKey.name === watch.column_statistics.field,
        )[0].type,
      ) ? (
        <MenuItem value={key.name} key={v4()}>
          {key.name}
        </MenuItem>
      ) : null,
    );
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={theme.spacing(2)}
      marginBottom={theme.spacing(4)}
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
        <Box sx={{ height: "100%" }}>
          <Divider orientation="vertical" sx={{ borderRightWidth: "2px" }} />
        </Box>
        <Stack sx={{ pl: 4, py: 4, pr: 1 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: theme.spacing(2),
            }}
          >
            <Typography variant="body2" sx={{ fontStyle: "italic" }}>
              {t("panels.tools.aggregate.statistics_text")}
            </Typography>
            <Box>
              <LayerFieldSelector
                label={t("panels.tools.select_field")}
                selectedField={
                  keysToSelect.filter(
                    (key) => key.name === watch.column_statistics.field,
                  )[0]
                }
                setSelectedField={(field: {
                  type: "string" | "number";
                  name: string;
                }) => {
                  if (field) {
                    setValue("column_statistics.field", field.name);
                  } else {
                    setValue("column_statistics.field", "");
                  }
                }}
                fields={keysToSelect}
              />
            </Box>
            <Box>
              <FormControl fullWidth size="small">
                <InputLabel>
                  {t("panels.tools.select_method")}
                </InputLabel>
                <Select
                  disabled={!watch.column_statistics.field}
                  label={t("panels.tools.select_method")}
                  error={!!errors.column_statistics?.field}
                  value={
                    watch.column_statistics.operation
                      ? watch.column_statistics.operation
                      : ""
                  }
                  {...register("column_statistics.operation")}
                >
                  {watch.column_statistics.field ? checkType() : null}
                </Select>
                {!!errors.column_statistics &&
                  errors.column_statistics.operation && (
                    <Typography sx={{ fontSize: "10px" }} color="error">
                      {errors.column_statistics.operation.message}
                    </Typography>
                  )}
              </FormControl>
            </Box>
            <Box sx={{ maxWidth: "100%" }}>
              <FormControl fullWidth size="small">
                <InputLabel>
                  Select Field Group
                </InputLabel>
                <Select
                  disabled={!watch.source_layer_project_id}
                  multiple
                  error={!!errors.source_group_by_field}
                  label="Select Field Group"
                  value={
                    watch.source_group_by_field
                      ? watch.source_group_by_field
                      : ""
                  }
                  renderValue={(selected) =>
                    selected ? selected.join(", ") : ""
                  }
                  {...register("source_group_by_field")}
                >
                  {pointLayerKeys.keys.map((key) => (
                    <MenuItem value={key.name} key={v4()}>
                      <Checkbox
                        checked={
                          watch.source_group_by_field &&
                          watch.source_group_by_field.indexOf(key.name) > -1
                        }
                      />
                      {FieldTypeColors[key.type] && (
                        <FieldTypeTag fieldType={key.type}>
                          {key.type}
                        </FieldTypeTag>
                      )}
                      <ListItemText primary={key.name} />
                    </MenuItem>
                  ))}
                </Select>
                {!!errors.source_group_by_field && (
                  <Typography sx={{ fontSize: "10px" }} color="error">
                    {errors.source_group_by_field.message}
                  </Typography>
                )}
              </FormControl>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body1">
                Weigthed by intersecting area
              </Typography>
              <Switch
                checked={watch.weigthed_by_intersecting_area}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setValue(
                    "weigthed_by_intersecting_area",
                    event.target.checked,
                  );
                }}
                // {...register()}
                inputProps={{ "aria-label": "controlled" }}
              />
            </Box>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};
export default Statistics;
