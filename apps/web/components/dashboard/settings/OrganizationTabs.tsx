import React, { useState } from "react";
import { Box, Tab } from "@mui/material";
import { TabList, TabPanel, TabContext } from "@mui/lab";

const OrganizationTabs = () => {
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
              className={classes.tab}
            />
          ))}
        </TabList>
      </Box>
      {tabs.map((tab, index) => (
        <TabPanel
          value={`${index + 1}`}
          key={v4()}
          className={classes.tabPandel}
        >
          {tab.child}
        </TabPanel>
      ))}
    </TabContext>
  </Box>
  )
}

export default OrganizationTabs
