"use client";

import React from "react";
import {
  useTheme,
  Box,
  Container,
  Grid,
  Paper,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Link,
  ListItem,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { Icon, ICON_NAME } from "@p4b/ui/components/Icon";
import type { NavItem } from "@/types/common/navigation";

interface SettingsLayoutProps {
  children: React.ReactNode;
}

const SettingsLayout = (props: SettingsLayoutProps) => {
  const { children } = props;
  const pathname = usePathname();
  const theme = useTheme();

  const navigation: NavItem[] = [
    {
      link: "/settings/account",
      icon: ICON_NAME.USER,
      label: "Account",
      current: pathname?.includes("/account"),
    },
    {
      link: "/settings/teams",
      icon: ICON_NAME.USERS,
      label: "Teams",
      current: pathname?.includes("/teams"),
    },
    {
      link: "/settings/organization",
      icon: ICON_NAME.ORGANIZATION,
      label: "Organization",
      current: pathname?.includes("/organization"),
    },
    {
      link: "/settings/subscription",
      icon: ICON_NAME.CREDIT_CARD,
      label: "Subscriptions",
      current: pathname?.includes("/subscription"),
    },
  ];

  return (
    <Container sx={{ py: 10, px: 10 }} maxWidth="xl">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 8,
        }}
      >
        <Typography variant="h6">Settings</Typography>
      </Box>
      <Grid container justifyContent="space-between" spacing={4}>
        <Grid
          item
          xs={3}
          sx={{
            [theme.breakpoints.down("md")]: {
              display: "none",
            },
          }}
        >
          <Paper elevation={3}>
            <List
              sx={{ width: "100%" }}
              component="nav"
              aria-labelledby="settings-navigation"
            >
              {navigation.map((item) => (
                <Link
                  key={item.icon}
                  href={item.link}
                  component={NextLink}
                  passHref
                  style={{ textDecoration: "none" }}
                >
                  <ListItem
                    disablePadding
                    sx={{
                      display: "block",
                    }}
                  >
                    <ListItemButton
                      selected={item.current}
                      sx={{
                        minHeight: 48,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          ml: 0,
                          mr: 6,
                          justifyContent: "center",
                        }}
                      >
                        <Icon
                          iconName={item.icon}
                          fontSize="small"
                          htmlColor={
                            item.current
                              ? theme.palette.primary.main
                              : "inherit"
                          }
                        />
                      </ListItemIcon>
                      <ListItemText primary={item.label} />
                    </ListItemButton>
                  </ListItem>
                </Link>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={9}>
          <Paper elevation={3}>{children}</Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SettingsLayout;
