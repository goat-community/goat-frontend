"use client";

import React, { useContext, useEffect, useState } from "react";
import type { PaletteMode } from "@mui/material";
import {
  Typography,
  Box,
  MenuItem,
  useTheme,
  Stack,
  TextField,
  InputAdornment,
  Link,
  Divider,
} from "@mui/material";
import Cookies from "js-cookie";
import { THEME_COOKIE_NAME as themeCookieName } from "@/lib/constants";
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
import { languages, cookieName as lngCookieName } from "@/i18n/settings";
import NextLink from "next/link";
import { useTranslation } from "@/i18n/client";

const AccountPreferences = ({ params: { lng } }) => {
  const { t } = useTranslation(lng, "dashboard");
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const theme = useTheme();

  const { changeColorMode } = useContext(ColorModeContext);
  const themeModes = ["dark", "light"] as const;
  const units = ["metric", "imperial"] as const;

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
      Cookies.set(themeCookieName, systemSettings.client_theme);
      Cookies.set(lngCookieName, systemSettings.preferred_language);
    } catch (error) {
      console.error(error);
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
          <Divider />
          <Box>
            <Typography variant="body1" fontWeight="bold">
              {t("preferences")}
            </Typography>
            <Typography variant="caption">{t("manage_preferences")}</Typography>
          </Box>
          <Divider />
          <TextField
            select
            defaultValue={lng}
            label={t("language")}
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
              <MenuItem value={lng} key={lng} sx={{ p: 0 }}>
                <Link
                  sx={{ p: 2, width: "100%" }}
                  component={NextLink}
                  href={`/${lng}/settings/account/preferences`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  {t(lng)}
                </Link>
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            defaultValue={theme.palette.mode}
            label={t("theme")}
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
                {t(theme)}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            defaultValue="metric"
            label={t("measurement_unit")}
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
                {t(unit)}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </Box>
    </Box>
  );
};

export default AccountPreferences;
