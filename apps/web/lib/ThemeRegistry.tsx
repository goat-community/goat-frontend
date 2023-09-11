"use client";

import { ThemeProvider } from "@/lib/theme";
import CssBaseline from "@mui/material/CssBaseline";
import React from "react";
// import { NextAppDirEmotionCacheProvider } from "tss-react/next/appDir";
import NextAppDirEmotionCacheProvider from "@/lib/EmotionCache";

const ThemeRegistry = ({ children }: React.PropsWithChildren) => {
  return (
    <>
      <CssBaseline />
      <NextAppDirEmotionCacheProvider options={{ key: "mui" }}>
        <ThemeProvider>{children}</ThemeProvider>
      </NextAppDirEmotionCacheProvider>
    </>
  );
};

export default ThemeRegistry;