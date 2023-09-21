"use client";

import UserInfoMenu from "@/components/UserInfoMenu";
import { Chip, Stack, useTheme, Typography } from "@mui/material";
import Divider from "@mui/material/Divider";
import { Icon, ICON_NAME } from "@p4b/ui/components/Icon";
import { Toolbar } from "../header/Toolbar";

export type MapToolbarProps = {
  projectTitle: string;
  lastSaved: string;
  tags: string[];
  height: number;
};

export function MapToolbar(props: MapToolbarProps) {
  const theme = useTheme();
  const { tags, projectTitle, lastSaved, height } = props;

  return (
    <Toolbar
      height={height}
      LeftToolbarChild={
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            mx: theme.spacing(2),
            gap: theme.spacing(2),
          }}
        >
          <Typography variant="caption" sx={{ marginLeft: theme.spacing(5) }}>
            {projectTitle}
          </Typography>
          <Divider
            orientation="vertical"
            flexItem
            sx={{
              [theme.breakpoints.down("sm")]: {
                display: "none",
              },
            }}
          />
          <Typography
            variant="caption"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: theme.spacing(1),
              [theme.breakpoints.down("md")]: {
                display: "none",
              },
            }}
          >
            <Icon iconName={ICON_NAME.SAVE} style={{ fontSize: "13px" }} />
            Last saved: {lastSaved}
          </Typography>
          {tags &&
            tags.map((tag) => (
              <Chip
                variant="outlined"
                label={tag}
                key={tag}
                sx={{
                  mx: theme.spacing(1),
                  [theme.breakpoints.down("sm")]: {
                    display: "none",
                  },
                }}
              />
            ))}
        </Stack>
      }
      RightToolbarChild={
        <>
          <UserInfoMenu />
        </>
      }
    />
  );
}
