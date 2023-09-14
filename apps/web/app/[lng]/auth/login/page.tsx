"use client";

import { useTheme } from "@mui/material";
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Login() {
  const { status, data: session } = useSession();
  const theme = useTheme();
  if (
    status === "unauthenticated" ||
    session?.error === "RefreshAccessTokenError"
  ) {
    signIn(
      "keycloak",
      {},
      {
        theme: theme.palette.mode,
      },
    );
  }
  if (session && session?.error !== "RefreshAccessTokenError") {
    redirect(`/`);
  }

  return <></>;
}
