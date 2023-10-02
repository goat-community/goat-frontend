"use client";
import React from "react";
import Cookies from "js-cookie";
import NextAppDirEmotionCacheProvider from "./EmotionCache";
import ThemeProvider from "@p4b/ui/theme/ThemeProvider";
import type { PaletteMode } from "@mui/material";
import { THEME_COOKIE_NAME } from "@/lib/constants";
export const ColorModeContext = React.createContext({
  changeColorMode: (_mode: PaletteMode) => {},
});
export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const defaultMode = Cookies.get(THEME_COOKIE_NAME) as PaletteMode
  const [mode, setMode] = React.useState<PaletteMode>(defaultMode);
  const colorMode = React.useMemo(
    () => ({
      changeColorMode: (mode: PaletteMode) => {
        setMode(mode);
      },
    }),
    [],
  );
  return (
    <>
      <ColorModeContext.Provider value={colorMode}>
        <NextAppDirEmotionCacheProvider options={{ key: "mui" }}>
          <ThemeProvider
            settings={{
              mode,
            }}
          >
            {children}
          </ThemeProvider>
        </NextAppDirEmotionCacheProvider>
      </ColorModeContext.Provider>
    </>
  );
}
