import React from "react";
import { Tabs } from "@p4b/ui/components/Navigation/Tabs";

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

  return <Tabs tabs={tabs} />;
};

export default Settings;
