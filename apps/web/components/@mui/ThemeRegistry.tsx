"use client";
import React from "react";
import NextAppDirEmotionCacheProvider from "./EmotionCache";
import ThemeProvider from "@p4b/ui/theme/ThemeProvider";
import { CssBaseline } from "@mui/material";
export const ColorModeContext = React.createContext({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  toggleColorMode: () => {},
});
export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  let theme = "dark";
  if (typeof window !== "undefined") {
    theme = localStorage.getItem("theme") || "dark";
  }

  const [mode, setMode] = React.useState<"light" | "dark">(
    theme as "light" | "dark",
  );
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          localStorage.setItem(
            "theme",
            prevMode === "light" ? "dark" : "light",
          );
          if (prevMode === "light") {
            return "dark";
          }
          return "light";
        });
      },
    }),
    [],
  );
  return (
    <>
      <CssBaseline />
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
