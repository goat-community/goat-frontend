"use client";

import type { Theme } from "@mui/material";
import { Box, Stack, useMediaQuery } from "@mui/material";
import { useState } from "react";

import DashboardSidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/header/Header";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));
  const [navVisible, setNavVisible] = useState(false);

  return (
    <Stack component="div" width="100%" height="100%" overflow="hidden">
      <Header
        height={52}
        title="Workspace"
        showHambugerMenu={hidden}
        onMenuIconClick={() => {
          setNavVisible(!navVisible);
        }}
      />
      <Stack direction="row" height="100%" sx={{ overflow: "hidden" }}>
        <DashboardSidebar
          hidden={hidden}
          navVisible={navVisible}
          width={240}
          collapsedWidth={53}
          setNavVisible={setNavVisible}
        />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
          }}>
          {children}
        </Box>
      </Stack>
    </Stack>
  );
};

export default DashboardLayout;
