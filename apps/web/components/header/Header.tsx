"use client";

import UserInfoMenu from "@/components/UserInfoMenu";
import { Chip, useTheme, Typography, IconButton, Stack } from "@mui/material";
import Divider from "@mui/material/Divider";
import { ICON_NAME, Icon } from "@p4b/ui/components/Icon";
import { Toolbar } from "./Toolbar";
import JobsPopper from "@/components/jobs/JobsPopper";
import { parseISO, format } from "date-fns";

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
            <Typography variant="body2">
              Last saved: {format(parseISO(lastSaved), "hh:mma dd/MM/yyyy")}
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
            <IconButton
              size="small"
              onClick={() => {
                window.open("https://docs.goat.plan4better.de", "_blank");
              }}
            >
              <Icon iconName={ICON_NAME.HELP} fontSize="inherit" />
            </IconButton>
            <Divider orientation="vertical" flexItem />
            <UserInfoMenu />
          </Stack>
        </>
      }
    />
  );
}
