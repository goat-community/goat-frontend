import {
  Box,
  Typography,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  useTheme,
} from "@mui/material";
import React from "react";
import { v4 } from "uuid";
import { Icon, ICON_NAME } from "@p4b/ui/components/Icon";
import { useTranslation } from "@/i18n/client";
import { useGetLayerKeys } from "@/hooks/map/ToolsHooks";
import { useProjectLayers } from "@/lib/api/projects";
import { useParams } from "next/navigation";
import { getLayerStringIdById } from "@/lib/utils/helpers";

import type { UseFormRegister } from "react-hook-form";
import type { PostJoin } from "@/lib/validations/tools";

interface FieldsToMatchProps {
  register: UseFormRegister<PostJoin>;
  watch: PostJoin;
  // setFirstField: (value: string) => void;
  // firstField: string | undefined;
  // setSecondField: (value: string) => void;
  // secondField: string | undefined;
  // firstLayerId: string;
  // secondLayerId: string;
}

const FieldsToMatch = (props: FieldsToMatchProps) => {
  const {
    watch,
    register,
    // firstLayerId,
    // secondLayerId,
    // setFirstField,
    // setSecondField,
    // firstField,
    // secondField,
  } = props;
  const { t } = useTranslation("maps");

  const theme = useTheme();

  const { projectId } = useParams();

  const { layers } = useProjectLayers(projectId as string);

  const firstLayerKeys = useGetLayerKeys(
    `user_data.${getLayerStringIdById(
      layers ? layers : [],
      watch.target_layer_project_id,
    )
      .split("-")
      .join("")}`,
  );
  const secondLayerKeys = useGetLayerKeys(
    `user_data.${getLayerStringIdById(
      layers ? layers : [],
      watch.join_layer_project_id,
    )
      .split("-")
      .join("")}`,
  );

  return (
    <Box>
      <Typography variant="body1" sx={{ color: "black" }}>
        {t("panels.tools.join.set_field_to_match")}
      </Typography>
      <Typography variant="body2" sx={{ fontStyle: "italic" }}>
        {t("panels.tools.join.field_to_match_text")}
      </Typography>
      <Box
        sx={{
          backgroundColor: `${theme.palette.primary.light}14`,
          padding: `${theme.spacing(3.5)} ${theme.spacing(2)}`,
          marginTop: theme.spacing(2),
        }}
      >
        <Box>
          <Typography
            variant="body1"
            sx={{ color: "black", marginBottom: theme.spacing(2) }}
          >
            {t("panels.tools.join.target_field")}
          </Typography>
          <FormControl fullWidth size="small">
            <InputLabel id="demo-simple-select-label">
              {t("panels.tools.select_field")}
            </InputLabel>
            <Select
              disabled={!watch.target_layer_project_id}
              label={t("panels.tools.select_field")}
              {...register("target_field")}
              // value={firstField}
              // onChange={(event: SelectChangeEvent) => {
              //   setFirstField(event.target.value as string);
              // }}
            >
              {watch.target_layer_project_id
                ? firstLayerKeys.keys.map((key) => (
                    <MenuItem value={key.name} key={v4()}>
                      {key.name}
                    </MenuItem>
                  ))
                : null}
            </Select>
          </FormControl>
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          sx={{
            margin: `${theme.spacing(2)} 0px`,
          }}
        >
          <Icon
            iconName={ICON_NAME.REVERSE}
            htmlColor={theme.palette.primary.main}
          />
        </Box>
        <Box>
          <Typography
            variant="body1"
            sx={{ color: "black", marginBottom: theme.spacing(2) }}
          >
            {t("panels.tools.join.join_field")}
          </Typography>
          <FormControl fullWidth size="small">
            <InputLabel id="demo-simple-select-label">
              {t("panels.tools.select_field")}
            </InputLabel>
            <Select
              disabled={!watch.join_layer_project_id}
              label={t("panels.tools.select_field")}
              {...register("join_field")}
              // value={secondField}
              // onChange={(event: SelectChangeEvent) => {
              //   setSecondField(event.target.value as string);
              // }}
            >
              {watch.join_layer_project_id
                ? secondLayerKeys.keys.map((key) => (
                    <MenuItem value={key.name} key={v4()}>
                      {key.name}
                    </MenuItem>
                  ))
                : null}
            </Select>
          </FormControl>
        </Box>
      </Box>
    </Box>
  );
};

export default FieldsToMatch;
