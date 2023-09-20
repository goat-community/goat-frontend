"use client";

import React, { useState } from "react";
import { Box, Tab,  useTheme } from "@mui/material";
import { TabList, TabPanel, TabContext } from "@mui/lab";
import { v4 } from "uuid";

interface OrganizationTabsProps {
  tabs: {
    child: React.ReactNode;
    name: string;
  }[];
}

const OrganizationTabs = (props: OrganizationTabsProps) => {
  const { tabs } = props;

  const theme = useTheme();

  const [value, setValue] = useState("1");

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", typography: "14px" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            {tabs.map((tab, index) => (
              <Tab
                label={tab.name}
                value={`${index + 1}`}
                key={v4()}
                sx={{
                  padding: theme.spacing(2),
                  fontSize: "14px",
                  color: `${theme.palette.secondary.light}cc`,
                  [theme.breakpoints.down('sm')]: {
                    fontSize: "12px",
                  },
                }}
              />
            ))}
          </TabList>
        </Box>
        {tabs.map((tab, index) => (
          <TabPanel
            value={`${index + 1}`}
            key={v4()}
            sx={{ padding: "0", paddingTop: theme.spacing(3) }}
          >
            {tab.child}
          </TabPanel>
        ))}
      </TabContext>
    </Box>
  );
};

export default OrganizationTabs;
