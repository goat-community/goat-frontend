import React from "react";
import {
  Box,
  Typography,
  // Card,
  // RadioGroup,
  // FormControlLabel,
  // Radio,
  useTheme,
  TextField,
  // Select,
  // FormControl,
  // InputLabel,
  // MenuItem,
} from "@mui/material";
import { Icon, ICON_NAME } from "@p4b/ui/components/Icon";
// import { useFolders } from "@/lib/api/folders";
// import { v4 } from "uuid";
import { useTranslation } from "@/i18n/client";
import { useGetUniqueLayerName } from "@/hooks/map/ToolsHooks";

// import type { SelectChangeEvent } from "@mui/material";
import type { FieldValues, UseFormRegister } from "react-hook-form";
import type { PostAggregate, PostJoin } from "@/lib/validations/tools";
import type { PostIsochrone } from "@/lib/validations/isochrone";

interface SaveResultProps<T extends FieldValues> {
  register: UseFormRegister<T>; // eslint-disable-line
  watch: PostJoin | PostAggregate | PostIsochrone;
}

interface ResultTarget {
  result_target: {
    layer_name: string;
    folder_id: string;
    project_id: string | undefined;
  };
  [key: string]: unknown; // Allow any other keys
}

const SaveResult = (props: SaveResultProps<ResultTarget>) => {
  const { register, watch } = props;

  const theme = useTheme();
  const { t } = useTranslation("maps");

  const { uniqueName } = useGetUniqueLayerName(
    watch.layer_name ? watch.layer_name : "",
  );

  return (
    <Box display="flex" flexDirection="column" gap={theme.spacing(4)}>
      <Typography
        variant="body1"
        fontWeight="bold"
        sx={{ display: "flex", alignItems: "center", gap: theme.spacing(2) }}
      >
        <Icon iconName={ICON_NAME.DOWNLOAD} />
        {t("panels.tools.result")}
      </Typography>
      <Box>
        <TextField
          fullWidth
          value={uniqueName ? uniqueName : ""}
          label={t("panels.tools.output_name")}
          size="small"
          {...register("result_target.layer_name")}
        />
      </Box>
    </Box>
  );
};

export default SaveResult;
