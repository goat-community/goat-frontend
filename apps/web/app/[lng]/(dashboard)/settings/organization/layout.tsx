"use client";

import React from "react";
import OrganizationTabs from "@/components/dashboard/settings/OrganizationTabs";
import Overview from "./Overview";
import ManageUsers from "./ManageUsers";
import Teams from "./Teams";
import { useTranslation } from "@/i18n/client";
import { usePathname } from "next/navigation";

const Organization = () => {
  const pathname = usePathname();
  const { t } = useTranslation(pathname.split("/")[1], "dashboard");

  const tabsData = [
    {
      child: <Overview />,
      name: t("organization.overview"),
    },
    {
      child: <ManageUsers />,
      name: t("organization.manage_users.manage_users"),
    },
    {
      child: <Teams />,
      name: t("organization.teams.teams"),
    },
  ];
  
  return <OrganizationTabs tabs={tabsData} />;
};

export default Organization;
