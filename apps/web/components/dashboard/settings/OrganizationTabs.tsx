"use client";

import React, { useState } from "react";
import { Box, Tab, Typography, Button, useTheme } from "@mui/material";
import { TabList, TabPanel, TabContext } from "@mui/lab";
import { v4 } from "uuid";
import Banner from "./Banner";

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
            <Banner
              actions={<Button variant="outlined">Subscribe Now</Button>}
              content={
                <Typography
                  sx={{
                    color: "white",
                    "@media (max-width: 1268px)": {
                      fontSize: "14px",
                    },
                  }}
                  variant="body1"
                >
                  Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
                  Aenean commodo ligula eget dolor. Aenean massa. Cum sociis
                  natoque penatibus et magnis dis parturient montes, nascetur
                  ridiculus mus.{" "}
                </Typography>
              }
              image="https://s3-alpha-sig.figma.com/img/630a/ef8f/d732bcd1f3ef5d6fe31bc6f94ddfbca8?Expires=1687132800&Signature=aJvQ22UUlmvNjDlrgzV6MjJK~YgohUyT9mh8onGD-HhU5yMI0~ThWZUGVn562ihhRYqlyiR5Rskno84OseNhAN21WqKNOZnAS0TyT3SSUP4t4AZJOmeuwsl2EcgElMzcE0~Qx2X~LWxor1emexxTlWntivbnUeS6qv1DIPwCferjYIwWsiNqTm7whk78HUD1-26spqW3AXVbTtwqz3B8q791QigocHaK9b4f-Ulrk3lsmp8BryHprwgetHlToFNlYYR-SqPFrEeOKNQuEDKH0QzgGv3TX7EfBNL0kgP3Crued~JNth-lIEPCjlDRnFQyNpSiLQtf9r2tH9xIsKA~XQ__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4"
              imageSide="right"
            />
          </TabPanel>
        ))}
      </TabContext>
    </Box>
  );
};

export default OrganizationTabs;
