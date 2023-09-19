import React from "react";
import OrganizationTabs from "@/components/dashboard/settings/OrganizationTabs";
import { Box } from "@mui/material";

const tabsData = [
  {
    child: "Profile",
    name: "Profile",
  },
  {
    child: "PersonalPreferences",
    name: "Personal Preferences",
  },
];

const Settings = () => {
  const tabs = tabsData.map(({ child, name }) => {
    const Component = React.lazy(() => import(`@/app/[lng]/(dashboard)/settings/settings/${child}`));

    return {
      child: <Component />,
      name,
    };
  });

  return <Box><OrganizationTabs tabs={tabs} /></Box>;
};

export default Settings;