"use client";

import type { NavItem } from "@/types/common/navigation";
import { Box, Tab, Tabs } from "@mui/material";
import { ICON_NAME, Icon } from "@p4b/ui/components/Icon";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

interface AccountLayoutProps {
  children: React.ReactNode;
}

const AccountLayout = (props: AccountLayoutProps) => {
  const pathname = usePathname();

  const navigation: NavItem[] = [
    {
      link: "/profile",
      icon: ICON_NAME.USER,
      label: "Profile",
      current: pathname?.includes("/profile"),
    },
    {
      link: "/preferences",
      icon: ICON_NAME.SETTINGS,
      label: "Preferences",
      current: pathname?.includes("/preferences"),
    },
  ];
  return (
    <>
      <Tabs
        value={navigation.find((item) => item.current)?.link || false}
        variant="fullWidth"
        scrollButtons
      >
        {navigation.map((item) => (
          <Tab
            LinkComponent={NextLink}
            key={item.link}
            href={`/settings/account${item.link}`}
            icon={
              <Box sx={{ pr: 2 }}>
                <Icon
                  iconName={item.icon}
                  htmlColor="inherit"
                  style={{ fontSize: 15 }}
                />
              </Box>
            }
            iconPosition="start"
            label={item.label}
            value={item.link}
            sx={{
              ...(item.current && {
                color: "primary.main",
                fontWeight: "bold",
              }),
            }}
          />
        ))}
      </Tabs>
      {props.children}
    </>
  );
};

export default AccountLayout;
