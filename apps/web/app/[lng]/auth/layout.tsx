"use client";

import { useSession } from "next-auth/react";

import { Loading } from "@p4b/ui/components/Loading";
import AuthLayout from "@p4b/ui/components/AuthLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { status, data: session } = useSession();

  return (
    <AuthLayout>
      {!status ||
        session?.error === "RefreshAccessTokenError" ||
        (["unauthenticated", "loading"].includes(status) && <Loading />)}
      {children}
    </AuthLayout>
  );
}
