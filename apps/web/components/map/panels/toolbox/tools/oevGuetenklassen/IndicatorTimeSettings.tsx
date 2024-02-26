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
  styled,
} from "@mui/material";
import { Icon, ICON_NAME } from "@p4b/ui/components/Icon";
import { timeToSeconds, secondsToTime } from "@/lib/utils/helpers";
import { useTranslation } from "@/i18n/client";

import type { UseFormSetValue, FieldErrors } from "react-hook-form";
import type { PostOevGuetenKlassen } from "@/lib/validations/tools";

const TimeInput = styled("input")(({ theme }) => ({
  borderRadius: theme.spacing(2),
  border: `1px solid ${theme.palette.secondary.light}80`,
  background: "transparent",
  padding: `${theme.spacing(2)} ${theme.spacing(3)}`,
  width: "100%",
  fontFamily: "sans-serif",
  lineHeight: "20px",
  color: theme.palette.text.secondary,
  outline: "none",
  "&::-webkit-calendar-picker-indicator": {
    backgroundImage: `url('data:image/svg+xml;utf8,<svg fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M464 256A208 208 0 1 1 48 256a208 208 0 1 1 416 0zM0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"/></svg>')`,
    width: "12px",
    height: "12px",
    marginTop: "-1px",
    marginRight: "-1px",
    cursor: "pointer",
  },
}));

interface IndicatorTimeSettingsProps {
  setValue: UseFormSetValue<PostOevGuetenKlassen>;
  watch: PostOevGuetenKlassen;
  errors: FieldErrors<PostOevGuetenKlassen>;
}

const IndicatorTimeSettings = (props: IndicatorTimeSettingsProps) => {
  const { setValue, watch, errors } = props;

  const theme = useTheme();
  const { t } = useTranslation("maps");

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
          iconName={ICON_NAME.CLOCK}
          htmlColor={theme.palette.grey[700]}
          sx={{ fontSize: "18px" }}
        />
        {t("panels.tools.oev_gutenklassen.calculation_time")}
      </Typography>
      <Stack direction="row" alignItems="center" sx={{ pl: 2, mb: 4 }}>
        <Box sx={{ height: "100%" }}>
          <Divider orientation="vertical" sx={{ borderRightWidth: "2px" }} />
        </Box>
        <Stack sx={{ px: 3, py: 4, flexGrow: 1 }}>
          <Box
            display="flex"
            flexDirection="column"
            gap={theme.spacing(2)}
            marginBottom={theme.spacing(4)}
            marginTop={theme.spacing(4)}
          >
            <FormControl fullWidth size="small">
              <InputLabel>
                {t("panels.tools.oev_gutenklassen.week_time")}
              </InputLabel>
              <Select
                fullWidth
                label={t("panels.tools.oev_gutenklassen.week_time")}
                error={!!errors.time_window?.weekday}
                value={watch.time_window.weekday}
                onChange={(e) => {
                  setValue("time_window.weekday", e.target.value as string);
                }}
              >
                <MenuItem value="weekday">
                  {t("panels.tools.oev_gutenklassen.weekday")}
                </MenuItem>
                <MenuItem value="saturday">
                  {t("panels.tools.oev_gutenklassen.saturday")}
                </MenuItem>
                <MenuItem value="saturday">
                  {t("panels.tools.oev_gutenklassen.sunday")}
                </MenuItem>
              </Select>
              {!!errors.time_window?.weekday && (
                <Typography sx={{ fontSize: "10px" }} color="error">
                  {errors.time_window?.weekday.message}
                </Typography>
              )}
            </FormControl>
          </Box>
          <Box sx={{ display: "flex", gap: theme.spacing(2) }}>
            <Box sx={{ width: "50%" }}>
              <Typography variant="body2" fontWeight={600}>
                {t("panels.tools.oev_gutenklassen.from")}
              </Typography>
              <TimeInput
                type="time"
                value={secondsToTime(watch.time_window.from_time)}
                onChange={(e) => {
                  if (
                    timeToSeconds(e.target.value) > watch.time_window.to_time
                  ) {
                    setValue(
                      "time_window.to_time",
                      timeToSeconds(e.target.value) + 3600,
                    );
                  }
                  setValue(
                    "time_window.from_time",
                    timeToSeconds(e.target.value) as number,
                  );
                }}
                required
              />
            </Box>
            <Box sx={{ width: "50%" }}>
              <Typography variant="body2" fontWeight={600}>
                {t("panels.tools.oev_gutenklassen.to")}
              </Typography>
              <TimeInput
                type="time"
                required
                value={secondsToTime(watch.time_window.to_time)}
                onChange={(e) => {
                  if (
                    timeToSeconds(e.target.value) < watch.time_window.from_time
                  ) {
                    setValue(
                      "time_window.from_time",
                      timeToSeconds(e.target.value) - 3600,
                    );
                  }
                  setValue(
                    "time_window.to_time",
                    timeToSeconds(e.target.value) as number,
                  );
                }}
              />
            </Box>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};

export default IndicatorTimeSettings;
