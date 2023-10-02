"use client";

import React, { useContext, useEffect, useState } from "react";
import {
  Typography,
  Box,
  MenuItem,
  useTheme,
  Stack,
  TextField,
  InputAdornment,
  PaletteMode,
} from "@mui/material";
import Cookies from "js-cookie";
import { THEME_COOKIE_NAME } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ICON_NAME, Icon } from "@p4b/ui/components/Icon";
import DarkModeIcon from "@mui/icons-material/Brightness4";
import LightModeIcon from "@mui/icons-material/Brightness7";
import {
  systemSettingsSchemaUpdate,
  type SystemSettingsUpdate,
} from "@/lib/validations/system";
import { updateSystemSettings } from "@/lib/api/system";
import { toast } from "react-toastify";
import { ColorModeContext } from "@/components/@mui/ThemeRegistry";
const AccountPreferences = () => {
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const theme = useTheme();

  const { changeColorMode } = useContext(ColorModeContext);
  const themeModes = ["dark", "light"] as const;
  const units = ["metric", "imperial"] as const;
  const languages = ["en", "de"] as const;

  const {
    register: registerSystemSettings,
    handleSubmit: handleSystemSettingsSubmit,
    watch: watchSystemSettings,
  } = useForm<SystemSettingsUpdate>({
    mode: "onChange",
    resolver: zodResolver(systemSettingsSchemaUpdate),
  });
  async function onSystemSettingsSubmit(systemSettings: SystemSettingsUpdate) {
    try {
      setIsBusy(true);
      await updateSystemSettings(systemSettings);
      changeColorMode(systemSettings.client_theme as PaletteMode);
      Cookies.set(THEME_COOKIE_NAME, systemSettings.client_theme);
    } catch (error) {
      toast.error("Failed to update system settings");
    } finally {
      setIsBusy(false);
    }
  }

  useEffect(() => {
    const subscription = watchSystemSettings(() => {
      handleSystemSettingsSubmit(onSystemSettingsSubmit)();
    });
    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchSystemSettings, handleSystemSettingsSubmit]);

  return (
    <Box sx={{ p: 4 }}>
      <Box component="form">
        <Stack spacing={theme.spacing(6)}>
          <Box>
            <Typography variant="body1" fontWeight="bold">
              Client
            </Typography>
          </Box>
          <TextField
            select
            defaultValue="en"
            label="Language"
            size="medium"
            disabled={isBusy}
            {...registerSystemSettings("preferred_language")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Icon iconName={ICON_NAME.LANGUAGE} fontSize="small" />
                </InputAdornment>
              ),
            }}
          >
            {languages.map((lng) => (
              <MenuItem key={lng} value={lng}>
                {lng}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            defaultValue={theme.palette.mode}
            label="Theme"
            size="medium"
            disabled={isBusy}
            {...registerSystemSettings("client_theme")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {theme.palette.mode === "dark" ? (
                    <DarkModeIcon fontSize="small" />
                  ) : (
                    <LightModeIcon fontSize="small" />
                  )}
                </InputAdornment>
              ),
            }}
          >
            {themeModes.map((theme) => (
              <MenuItem key={theme} value={theme}>
                {theme}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            defaultValue="metric"
            label="Measurement unit"
            size="medium"
            disabled={isBusy}
            {...registerSystemSettings("unit")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Icon iconName={ICON_NAME.RULES_COMBINED} fontSize="small" />
                </InputAdornment>
              ),
            }}
          >
            {units.map((unit) => (
              <MenuItem key={unit} value={unit}>
                {unit}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </Box>
    </Box>
  );
};

export default AccountPreferences;
