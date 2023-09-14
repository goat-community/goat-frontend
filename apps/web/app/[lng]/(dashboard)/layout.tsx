"use client";

import Header from "@/components/header/Header";
import { Box } from "@mui/material";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header height={52} projectTitle="Test" />
      <Box>{children}</Box>
    </>
  );
};

export default DashboardLayout;
