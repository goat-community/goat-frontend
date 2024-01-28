import React from "react";
import {
  Typography,
  useTheme,
  Box,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Stack,
  Divider,
} from "@mui/material";
import { v4 } from "uuid";
import { useTranslation } from "@/i18n/client";
import { useProjectLayers } from "@/lib/api/projects";
import { useParams } from "next/navigation";
import { Icon, ICON_NAME } from "@p4b/ui/components/Icon";

import type {
  UseFormSetValue,
  UseFormRegister,
  FieldErrors,
} from "react-hook-form";
import type { PostJoin } from "@/lib/validations/tools";

interface PickLayerProps {
  setValue: UseFormSetValue<PostJoin>;
  watch: PostJoin;
  register: UseFormRegister<PostJoin>;
  errors: FieldErrors<PostJoin>;
}
const InputLayer = (props: PickLayerProps) => {
  const {
    // setValue,
    watch,
    register,
    errors,
  } = props;

  const theme = useTheme();
  const { t } = useTranslation("maps");

  const { projectId } = useParams();

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
        Pick Layers
      </Typography>
      <Stack direction="row" alignItems="center" sx={{ pl: 2, mb: 4 }}>
        <Box sx={{height: "100%"}}>
          <Divider orientation="vertical" sx={{ borderRightWidth: "2px" }} />
        </Box>
        <Stack sx={{ pl: 4, py: 4, pr: 1 }}>
          <Box>
            <Box
              display="flex"
              flexDirection="column"
              gap={theme.spacing(2)}
              marginBottom={theme.spacing(4)}
            >
              <Typography
                variant="body2"
                sx={{ fontStyle: "italic", marginBottom: theme.spacing(2) }}
              >
                {t("panels.tools.join.target_layer_text")}
              </Typography>
              <FormControl fullWidth size="small">
                <InputLabel>
                  Target Layer
                </InputLabel>
                <Select
                  label="Target Layer"
                  error={!!errors.target_layer_project_id}
                  value={
                    watch.target_layer_project_id
                      ? watch.target_layer_project_id
                      : ""
                  }
                  {...register("target_layer_project_id")}
                >
                  {projectLayers
                    ? projectLayers.map((layer) => (
                        <MenuItem value={layer.id} key={v4()}>
                          {layer.name}
                        </MenuItem>
                      ))
                    : null}
                </Select>
                {!!errors.target_layer_project_id && (
                  <Typography sx={{ fontSize: "10px" }} color="error">
                    {errors.target_layer_project_id.message}
                  </Typography>
                )}
              </FormControl>
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              gap={theme.spacing(2)}
            >
              <FormControl fullWidth size="small">
                <InputLabel>
                  Join Layer
                </InputLabel>
                <Select
                  label="Join Layer"
                  error={!!errors.join_layer_project_id}
                  value={
                    watch.join_layer_project_id
                      ? watch.join_layer_project_id
                      : ""
                  }
                  {...register("join_layer_project_id")}
                >
                  {projectLayers
                    ? projectLayers.map((layer) => (
                        <MenuItem value={layer.id} key={v4()}>
                          {layer.name}
                        </MenuItem>
                      ))
                    : null}
                </Select>
                {!!errors.join_layer_project_id && (
                  <Typography sx={{ fontSize: "10px" }} color="error">
                    {errors.join_layer_project_id.message}
                  </Typography>
                )}
              </FormControl>
            </Box>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};

export default InputLayer;
