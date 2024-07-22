"use client";

import { Box, Tab, Tabs } from "@mui/material";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

import { ICON_NAME, Icon } from "@p4b/ui/components/Icon";

import { useTranslation } from "@/i18n/client";

import type { NavItem } from "@/types/common/navigation";

interface OrganizationLayoutProps {
  children: React.ReactNode;
}

const OrganizationLayout = (props: OrganizationLayoutProps) => {
  const pathname = usePathname();
  const { t } = useTranslation("common");

  const navigation: NavItem[] = [
    {
      link: "/profile",
      icon: ICON_NAME.ORGANIZATION,
      label: t("profile"),
      current: pathname?.includes("/profile"),
    },
    {
      link: "/members",
      icon: ICON_NAME.USERS,
      label: t("members"),
      current: pathname?.includes("/members"),
    },
  ];
  return (
    <>
      <Tabs value={navigation.find((item) => item.current)?.link || false} variant="fullWidth" scrollButtons>
        {navigation.map((item) => (
          <Tab
            LinkComponent={NextLink}
            key={item.link}
            href={`/settings/organization${item.link}`}
            icon={
              <Box sx={{ pr: 2 }}>
                <Icon iconName={item.icon} htmlColor="inherit" style={{ fontSize: 15 }} />
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

export default OrganizationLayout;
