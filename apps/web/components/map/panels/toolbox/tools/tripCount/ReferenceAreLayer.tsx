import React from "react";
import {
  Box,
  Typography,
  Stack,
  Divider,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Icon, ICON_NAME } from "@p4b/ui/components/Icon";
import { useTranslation } from "@/i18n/client";
import { useProjectLayers } from "@/lib/api/projects";
import { v4 } from "uuid";
import { useParams } from "next/navigation";

import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { PostOevGuetenKlassen } from "@/lib/validations/tools";

interface ReferenceAreLayerProps {
  register: UseFormRegister<PostOevGuetenKlassen>;
  watch: PostOevGuetenKlassen;
  errors: FieldErrors<PostOevGuetenKlassen>;
}

const ReferenceAreLayer = (props: ReferenceAreLayerProps) => {
  const { register, watch, errors } = props;

  const { projectId } = useParams();
  const { t } = useTranslation("maps");
  const theme = useTheme();
  const { layers: projectLayers } = useProjectLayers(
    typeof projectId === "string" ? projectId : "",
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
          iconName={ICON_NAME.LAYERS}
          htmlColor={theme.palette.grey[700]}
          sx={{ fontSize: "18px" }}
        />
        {t("panels.tools.oev_gutenklassen.reference_area_layer")}
      </Typography>
      <Stack direction="row" alignItems="center" sx={{ pl: 2, mb: 4 }}>
        <Box sx={{ height: "100%" }}>
          <Divider orientation="vertical" sx={{ borderRightWidth: "2px" }} />
        </Box>
        <Stack sx={{ pl: 4, py: 4, pr: 1, flexGrow: 1 }}>
          <Box
            display="flex"
            flexDirection="column"
            gap={theme.spacing(2)}
            marginTop={theme.spacing(3)}
          >
            <FormControl fullWidth size="small">
              <InputLabel>
                {t("panels.tools.select_layer")}
              </InputLabel>
              <Select
                label={t("panels.tools.select_layer")}
                error={!!errors.reference_area_layer_project_id}
                value={
                  watch.reference_area_layer_project_id
                    ? watch.reference_area_layer_project_id
                    : ""
                }
                {...register("reference_area_layer_project_id")}
              >
                {projectLayers
                  ? projectLayers.map((layer) =>
                      layer.feature_layer_geometry_type === "polygon" ? (
                        <MenuItem value={layer.id} key={v4()}>
                          {layer.name}
                        </MenuItem>
                      ) : null,
                    )
                  : null}
              </Select>
              {!!errors.reference_area_layer_project_id && (
                <Typography sx={{ fontSize: "10px" }} color="error">
                  {errors.reference_area_layer_project_id.message}
                </Typography>
              )}
            </FormControl>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ReferenceAreLayer;
