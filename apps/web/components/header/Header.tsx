"use client";

import UserInfoMenu from "@/components/UserInfoMenu";
import { Chip, useTheme, Typography, Stack } from "@mui/material";
import Divider from "@mui/material/Divider";
import { Toolbar } from "./Toolbar";
import JobsPopper from "@/components/jobs/JobsPopper";
import { parseISO, format } from "date-fns";
import { useTranslation } from "@/i18n/client";

export type HeaderProps = {
  title: string;
  lastSaved?: string;
  tags?: string[];
  showHambugerMenu?: boolean;
  onMenuIconClick?: () => void;
  height?: number;
};

export default function Header(props: HeaderProps) {
  const theme = useTheme();
  const { t } = useTranslation(["maps"]);
  const {
    tags,
    title,
    lastSaved,
    onMenuIconClick,
    showHambugerMenu,
    height = 52,
  } = props;

  return (
    <Toolbar
      showHambugerMenu={showHambugerMenu}
      onMenuIconClick={onMenuIconClick}
      height={height}
      LeftToolbarChild={
        <>
          <Typography variant="body1" fontWeight="bold">
            {title}
          </Typography>
          <Divider orientation="vertical" flexItem />
          {lastSaved && (
            <Typography variant="caption">
              {`${t("maps:last_saved")}: ${format(
                parseISO(lastSaved),
                "hh:mma dd/MM/yyyy",
              )
                .replace("PM", " PM")
                .replace("AM", " AM")}`}
            </Typography>
          )}
          {tags &&
            tags.map((tag) => (
              <Chip
                variant="outlined"
                label={tag}
                key={tag}
                sx={{
                  mx: theme.spacing(1),
                }}
              />
            ))}
        </>
      }
      RightToolbarChild={
        <>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <JobsPopper />
            <Divider orientation="vertical" flexItem />
            <UserInfoMenu />
          </Stack>
        </>
      }
    />
  );
}
