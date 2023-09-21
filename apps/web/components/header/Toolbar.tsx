"use client";

import React from "react";

import {
  AppBar,
  Box,
  Stack,
  Toolbar as MUIToolbar,
  useTheme,
  IconButton,
  Divider,
} from "@mui/material";
import { Icon, ICON_NAME } from "@p4b/ui/components/Icon";

import { GOATLogoIconOnlyGreen } from "@p4b/ui/assets/svg/GOATLogoIconOnlyGreen";

export type MapToolbarProps = {
  LeftToolbarChild?: React.ReactNode;
  RightToolbarChild?: React.ReactNode;
  height: number;
  showHambugerMenu?: boolean;
  onMenuIconClick?: () => void;
};

export function Toolbar(props: MapToolbarProps) {
  const { LeftToolbarChild, RightToolbarChild, height, showHambugerMenu, onMenuIconClick } = props;

  const theme = useTheme();

  return (
    <AppBar color="primary" sx={{ zIndex: (theme) => theme.zIndex.drawer + 2 }}>
      <MUIToolbar variant="dense" sx={{ minHeight: height, height: height }}>
      {showHambugerMenu && (
          <>
            <IconButton onClick={onMenuIconClick}>
              <Icon iconName={ICON_NAME.HAMBURGER_MENU} fontSize="inherit" />
            </IconButton>

            <Divider orientation="vertical" flexItem sx={{ ml: 2, mr: 3 }} />
          </>
        )}
        
        <GOATLogoIconOnlyGreen
          style={{ width: "30px", height: "30px", cursor: "pointer" }}
        />
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            mx: theme.spacing(2),
            gap: theme.spacing(2),
          }}
        >
          {LeftToolbarChild}
        </Stack>
        <Box sx={{ flexGrow: 1 }} />

        {RightToolbarChild}
      </MUIToolbar>
    </AppBar>
  );
}
