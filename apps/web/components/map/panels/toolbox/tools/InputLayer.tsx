import React from "react";
import {
  Typography,
  useTheme,
  Box,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";
import { v4 } from "uuid";
import { useTranslation } from "@/i18n/client";
import { useProjectLayers } from "@/lib/api/projects";
import { useParams } from "next/navigation";

import type { SelectChangeEvent } from "@mui/material";
import type { UseFormSetValue, UseFormRegister } from "react-hook-form";
import type { PostJoin, PostAggregate } from "@/lib/validations/tools";

interface PickLayerProps {
  setValue: UseFormSetValue<PostJoin> | UseFormSetValue<PostAggregate>;
  watch: PostJoin | PostAggregate;
  multiple?: boolean;
  // inputValues: string | string[];
  // setInputValues: (value: string | string[]) => void;
  layerTypes?: string[];
}

const InputLayer = (props: PickLayerProps) => {
  const {
    setValue,
    watch,
    layerTypes,
    multiple = false, 
  } = props;

  const theme = useTheme();
  const { t } = useTranslation("maps");

  const { projectId } = useParams();

  const { layers: projectLayers } = useProjectLayers(
    typeof projectId === "string" ? projectId : "",
  );

  return (
    <Box>
      {multiple ? (
        <>
          <Box
            display="flex"
            flexDirection="column"
            gap={theme.spacing(2)}
            marginBottom={theme.spacing(4)}
          >
            <Typography variant="body1" sx={{ color: "black" }}>
              {t("panels.tools.join.pick_target_layer")}
            </Typography>
            <Typography variant="body2" sx={{ fontStyle: "italic" }}>
              {t("panels.tools.join.target_layer_text")}
            </Typography>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">
                {t("panels.tools.select_layer")}
              </InputLabel>
              <Select
                label={t("panels.tools.select_layer")}
                // value={inputValues[0]}
                value={"point_layer_id" in watch ? null : watch.target_layer_id}
                // {...register("")}
                onChange={(event: SelectChangeEvent) =>
                  setValue("target_layer_id", event.target.value as string)
                }
              >
                {projectLayers
                  ? projectLayers.map((layer) => (
                      <MenuItem value={layer.layer_id} key={v4()}>
                        {layer.name}
                      </MenuItem>
                    ))
                  : null}
              </Select>
            </FormControl>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            gap={theme.spacing(2)}
            marginBottom={theme.spacing(4)}
          >
            <Typography
              variant="body1"
              sx={{ color: "black", marginBottom: theme.spacing(2) }}
            >
              {t("panels.tools.join.pick_join_layer")}
            </Typography>
            <Typography variant="body2" sx={{ fontStyle: "italic" }}>
              {t("panels.tools.join.join_layer_text")}
            </Typography>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">
                {t("panels.tools.select_layer")}
              </InputLabel>
              <Select
                label={t("panels.tools.select_layer")}
                value={"point_layer_id" in watch ? null : watch.join_layer_id}
                // onChange={(event: SelectChangeEvent) =>
                //   handleMultipleChange(event, 1)
                // }
                onChange={(event: SelectChangeEvent) =>
                  setValue("join_layer_id", event.target.value as string)
                }
              >
                {projectLayers
                  ? projectLayers.map((layer) => (
                      <MenuItem value={layer.layer_id} key={v4()}>
                        {layer.name}
                      </MenuItem>
                    ))
                  : null}
              </Select>
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          flexDirection="column"
          gap={theme.spacing(2)}
          marginBottom={theme.spacing(4)}
        >
          <Typography variant="body1" sx={{ color: "black" }}>
            {t("panels.tools.aggregate.pick_layer")}
          </Typography>
          <Typography variant="body2" sx={{ fontStyle: "italic" }}>
            {t("panels.tools.aggregate.pick_layer_text")}
          </Typography>
          <FormControl fullWidth size="small">
            <InputLabel id="demo-simple-select-label">
              {" "}
              {t("panels.tools.select_layer")}
            </InputLabel>
            <Select
              label={t("panels.tools.select_layer")}
              value={"point_layer_id" in watch ? watch.point_layer_id :null}
              onChange={(event: SelectChangeEvent) =>
                setValue("point_layer_id", event.target.value as string)
              }
            >
              {projectLayers
                ? projectLayers.map((layer) =>
                    layerTypes.includes(layer.feature_layer_geometry_type) ? (
                      <MenuItem value={layer.layer_id} key={v4()}>
                        {layer.name}
                      </MenuItem>
                    ) : null,
                  )
                : null}
            </Select>
          </FormControl>
        </Box>
      )}
    </Box>
  );
};

export default InputLayer;