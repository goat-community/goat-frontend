import {
  Box,
  Typography,
  // Select,
  // FormControl,
  // InputLabel,
  // MenuItem,
  useTheme,
  Stack,
  Divider,
} from "@mui/material";
import React from "react";
// import { v4 } from "uuid";
import { Icon, ICON_NAME } from "@p4b/ui/components/Icon";
import { useTranslation } from "@/i18n/client";
import { useGetLayerKeys } from "@/hooks/map/ToolsHooks";
import { useProjectLayers } from "@/lib/api/projects";
import { useParams } from "next/navigation";
import { getLayerStringIdById } from "@/lib/utils/helpers";

import type {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormTrigger
} from "react-hook-form";
import type { PostOriginDestination } from "@/lib/validations/tools";
import LayerFieldSelector from "@/components/map/common/LayerFieldSelector";

interface FieldsToMatchProps {
  register: UseFormRegister<PostOriginDestination>;
  watch: PostOriginDestination;
  errors: FieldErrors<PostOriginDestination>;
  setValue: UseFormSetValue<PostOriginDestination>;
  trigger: UseFormTrigger<PostOriginDestination>;
}

const ODSettings = (props: FieldsToMatchProps) => {
  const { watch, setValue, trigger } = props;
  const { t } = useTranslation("maps");

  const theme = useTheme();

  const { projectId } = useParams();

  const { layers } = useProjectLayers(projectId as string);

  const firstLayerKeys = useGetLayerKeys(
    `user_data.${getLayerStringIdById(
      layers ? layers : [],
      watch.geometry_layer_project_id,
    )
      .split("-")
      .join("")}`,
  );
  const secondLayerKeys = useGetLayerKeys(
    `user_data.${getLayerStringIdById(
      layers ? layers : [],
      watch.origin_destination_matrix_layer_project_id,
    )
      .split("-")
      .join("")}`,
  );

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
          iconName={ICON_NAME.SETTINGS}
          htmlColor={theme.palette.grey[700]}
          sx={{ fontSize: "18px" }}
        />
        {t("panels.tools.origin_to_destination.origin_to_destination")}
      </Typography>
      <Stack direction="row" alignItems="center" sx={{ pl: 2, mb: 4 }}>
        <Box sx={{ height: "100%" }}>
          <Divider orientation="vertical" sx={{ borderRightWidth: "2px" }} />
        </Box>
        <Stack sx={{ px: 3, py: 4, marginTop: theme.spacing(2), flexGrow: 1 }}>
          <Box sx={{display: "flex", flexDirection: "column", gap: theme.spacing(3)}}>
            <Typography variant="body2" sx={{ fontStyle: "italic" }}>
              {t("panels.tools.origin_to_destination.od_settings")}
            </Typography>
            <Box sx={{ width: "100%", mt: 2 }}>
              <LayerFieldSelector
                label={t("panels.tools.origin_to_destination.origin_field")}
                selectedField={
                  secondLayerKeys.keys.filter(
                    (key) => key.name === watch.origin_column,
                  )[0]
                }
                setSelectedField={(field: {
                  type: "string" | "number";
                  name: string;
                }) => {
                  if (field) {
                    setValue("origin_column", field.name);
                  } else {
                    setValue("origin_column", "");
                  }
                  trigger("origin_column");
                }}
                fields={secondLayerKeys.keys}
              />
            </Box>
            <Box>
              <LayerFieldSelector
                label={t("panels.tools.origin_to_destination.destination_field")}
                selectedField={
                  secondLayerKeys.keys.filter(
                    (key) => key.name === watch.destination_column,
                  )[0]
                }
                setSelectedField={(field: {
                  type: "string" | "number";
                  name: string;
                }) => {
                  if (field) {
                    setValue("destination_column", field.name);
                  } else {
                    setValue("destination_column", "");
                  }
                  trigger("destination_column");
                }}
                fields={secondLayerKeys.keys}
              />
            </Box>
            <Box>
              <LayerFieldSelector
                label={t("panels.tools.origin_to_destination.unique_id_field")}
                selectedField={
                  firstLayerKeys.keys.filter(
                    (key) => key.name === watch.unique_id_column,
                  )[0]
                }
                setSelectedField={(field: {
                  type: "string" | "number";
                  name: string;
                }) => {
                  if (field) {
                    setValue("unique_id_column", field.name);
                  } else {
                    setValue("unique_id_column", "");
                  }
                  trigger("unique_id_column");
                }}
                fields={firstLayerKeys.keys}
              />
            </Box>
            <Box>
              <LayerFieldSelector
                label={t("panels.tools.origin_to_destination.weight_field")}
                selectedField={
                  secondLayerKeys.keys.filter(
                    (key) => key.name === watch.weight_column,
                  )[0]
                }
                setSelectedField={(field: {
                  type: "string" | "number";
                  name: string;
                }) => {
                  if (field) {
                    setValue("weight_column", field.name);
                  } else {
                    setValue("weight_column", "");
                  }
                  trigger("weight_column");
                }}
                fields={secondLayerKeys.keys}
              />
            </Box>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ODSettings;
