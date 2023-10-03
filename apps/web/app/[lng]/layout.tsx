import { languages } from "@/i18n/settings";
import ThemeRegistry from "@/components/@mui/ThemeRegistry";
import AuthProvider from "@/lib/providers/AuthProvider";
import ToastProvider from "@/lib/providers/ToastProvider";
import StoreProvider from "@/lib/providers/StoreProvider";
import { cookies } from 'next/headers'
import { THEME_COOKIE_NAME } from "@/lib/constants";
import "@/styles/globals.css";
import { dir } from "i18next";
import type { Metadata } from "next";
import "react-toastify/dist/ReactToastify.css";
import { Mulish } from "next/font/google";
import type { PaletteMode } from "@mui/material";

const mulish = Mulish({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | GOAT",
    default: "GOAT",
  },
  description: "Geo Open Accessibiliy Tool",
};

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

export default function RootLayout({
  children,
  params: { lng },
}: {
  children: React.ReactNode;
  params: { lng: string };
}) {
  const cookieStore = cookies()
  const theme = cookieStore.get(THEME_COOKIE_NAME)?.value as PaletteMode
  return (
    <html lang={lng} dir={dir(lng)}>
      <body className={mulish.className}>
        <StoreProvider>
          <AuthProvider>
            <ThemeRegistry theme={theme}>
              <ToastProvider>{children} </ToastProvider>
            </ThemeRegistry>
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
