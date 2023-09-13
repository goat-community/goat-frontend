"use client";

import React, { useState } from "react";
import { Box, Tab } from "@mui/material";
import { TabList, TabPanel, TabContext } from "@mui/lab";
import { v4 } from "uuid";
import { makeStyles } from "@/lib/theme";
// import { Tabs } from "@p4b/ui/components/Navigation/Tabs";

const tabsData = [
  {
    child: "Overview",
    name: "Overview",
  },
  {
    child: "ManageUsers",
    name: "Manage users",
  },
  {
    child: "Teams",
    name: "Teams",
  },
  {
    child: "Settings",
    name: "Settings",
  },
];

const Organization = () => {
  const { classes } = useStyles();

  const tabs = tabsData.map(({ child, name }) => {
    const Component = React.lazy(
      () => import(`@/app/[lng]/(dashboard)/settings/organization/${child}`),
    );

    return {
      child: <Component />,
      name,
    };
  });

  const [value, setValue] = useState("1");

  // functions
  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    
  );
};

const useStyles = makeStyles({ name: { Tabs } })((theme) => ({
  tab: {
    padding: theme.spacing(2),
    fontSize: "14px",
    color: `${theme.colors.palette.light.greyVariant2}cc`,
  },
  tabPandel: {
    padding: "0",
    paddingTop: theme.spacing(3),
  },
}));

export default Organization;
