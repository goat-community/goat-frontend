"use client";

import { Chip, IconButton, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import Divider from "@mui/material/Divider";
import { format, parseISO } from "date-fns";

import { ICON_NAME, Icon } from "@p4b/ui/components/Icon";

import { useTranslation } from "@/i18n/client";

import { DOCS_URL } from "@/lib/constants";

import UserInfoMenu from "@/components/UserInfoMenu";
import JobsPopper from "@/components/jobs/JobsPopper";

import { Toolbar } from "./Toolbar";

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
  const { t } = useTranslation(["common"]);
  const { tags, title, lastSaved, onMenuIconClick, showHambugerMenu, height = 52 } = props;

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
              {`${t("common:last_saved")}: ${format(parseISO(lastSaved), "hh:mma dd/MM/yyyy")
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
          <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
            <Tooltip title={t("common:open_documentation")}>
              <IconButton
                size="small"
                onClick={() => {
                  window.open(DOCS_URL, "_blank");
                }}>
                <Icon iconName={ICON_NAME.BOOK} fontSize="inherit" />
              </IconButton>
            </Tooltip>
            <JobsPopper />
            <Divider orientation="vertical" flexItem />
            <UserInfoMenu />
          </Stack>
        </>
      }
    />
  );
}
