"use client";

import React from "react";
import OrganizationTabs from "@/components/dashboard/settings/OrganizationTabs";
import Overview from "./Overview";
import ManageUsers from "./ManageUsers";
import Teams from "./Teams";

const tabsData = [
  {
    child: <Overview />,
    name: "Overview",
  },
  {
    child: <ManageUsers />,
    name: "Manage users",
  },
  {
    child: <Teams />,
    name: "Teams",
  },
];

const Organization = () => {
  return <OrganizationTabs tabs={tabsData} />;
};

export default Organization;
