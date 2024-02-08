import React from "react";
import {
  Box,
  Typography,
  useTheme,
  Stack,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
} from "@mui/material";
import { Icon, ICON_NAME } from "@p4b/ui/components/Icon";
import { v4 } from "uuid";
import { useTranslation } from "@/i18n/client";

import type { PostIsochrone } from "@/lib/validations/isochrone";
import type { UseFormSetValue, FieldErrors } from "react-hook-form";
import type { SelectChangeEvent } from "@mui/material";

interface AdvancedSettingsProps {
  watch: PostIsochrone;
  setValue: UseFormSetValue<PostIsochrone>;
  errors: FieldErrors<PostIsochrone>;
}

const AdvancedSettings = (props: AdvancedSettingsProps) => {
  const { watch, setValue, errors } = props;
  const theme = useTheme();

  const { t } = useTranslation("maps");

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: theme.spacing(2),
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
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
              sx={{ fontSize: "16px" }}
            />
            {t("panels.isochrone.advanced_settings")}
          </Typography>{" "}
        </Box>
      </Box>
      <Stack direction="row" alignItems="center" sx={{ pl: 2, mb: 3 }}>
        <Divider orientation="vertical" sx={{ borderRightWidth: "2px" }} />
        <Stack sx={{ px: 3, py: 4, flexGrow: "1" }}>
          <FormControl
            fullWidth
            size="small"
            sx={{
              margin: `${theme.spacing(1)} 0`,
            }}
          >
            <InputLabel>{t("panels.isochrone.isochrone_type")}</InputLabel>
            <Select
              label="Isochrone type"
              value={watch.isochrone_type}
              error={!!errors.isochrone_type}
              onChange={(event: SelectChangeEvent<string>) => {
                setValue("isochrone_type", event.target.value);
                if (event.target.value !== "polygon") {
                  setValue("polygon_difference", false);
                }
              }}
            >
              <MenuItem key={v4()} value="polygon">
                {t("panels.isochrone.polygon")}
              </MenuItem>
              <MenuItem key={v4()} value="network">
                {t("panels.isochrone.network")}
              </MenuItem>
              <MenuItem key={v4()} value="rectangular_grid">
                {t("panels.isochrone.rectangular_grid")}
              </MenuItem>
            </Select>
          </FormControl>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 2,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            {t("panels.isochrone.isochrone_difference")}
            </Typography>
            <Switch
              checked={watch.polygon_difference}
              disabled={watch.isochrone_type !== "polygon"}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setValue("polygon_difference", event.target.checked);
              }}
              inputProps={{ "aria-label": "controlled" }}
            />
          </Box>
        </Stack>
      </Stack>
    </>
  );
};

export default AdvancedSettings;
