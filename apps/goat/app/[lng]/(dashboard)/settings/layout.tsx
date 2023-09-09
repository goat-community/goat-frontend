"use client";

import GridContainer from "@/components/grid/GridContainer";
import SingleGrid from "@/components/grid/SingleGrid";
import { makeStyles } from "@/lib/theme";
import { Text } from "@/lib/theme";
import Link from "next/link";
import { usePathname } from "next/navigation";

import Box from "@p4b/ui/components/Box";
import { Divider } from "@p4b/ui/components/DataDisplay/Divider";

interface SettingsLayoutProps {
  children: React.ReactNode;
}

const Settings = (props: SettingsLayoutProps) => {
  const { children } = props;

  const pathname = usePathname();

  const { classes } = useStyles();

  return (
    <Box className={classes.root}>
      <GridContainer>
        <SingleGrid span={1}>
          <div>
            <Link href="/settings/organization" className={classes.link}>
              <span>
                <Text
                  typo="body 2"
                  className={
                    pathname.endsWith("/settings/organization") ? classes.selectedSidebarText : classes.SidebarText
                  }>
                  Organization
                </Text>
              </span>
            </Link>
            <Divider width="100%" color="main" className={classes.hr} />
            <Link href="/settings/subscription" className={classes.link}>
              <span>
                <Text
                  typo="body 2"
                  className={
                    pathname.endsWith("/settings/subscription") ? classes.selectedSidebarText : classes.SidebarText
                  }>
                  Subscription
                </Text>
              </span>
            </Link>
            <Divider width="100%" color="main" className={classes.hr} />
            <Link href="/settings/settings" className={classes.link}>
              <span>
                <Text
                  typo="body 2"
                  className={
                    pathname.endsWith("/settings/settings")
                      ? classes.selectedSidebarText
                      : classes.SidebarText
                  }>
                  Settings
                </Text>
              </span>
            </Link>
            <Divider width="100%" color="main" className={classes.hr} />
          </div>
        </SingleGrid>
        <SingleGrid span={3}>
          <div>{children}</div>
        </SingleGrid>
      </GridContainer>
    </Box>
  );
};

const useStyles = makeStyles({ name: { Settings } })((theme) => ({
  root: {
    marginTop: "100px",
  },
  wrapper: {
    display: "flex",
    gap: "1%",
  },
  SidebarText: {
    // padding: theme.spacing(1) theme.spacing(4),
    padding: `${theme.spacing(1)}px ${theme.spacing(4)}px`,
    cursor: "pointer",
    transition: "all .3s ease",
    "&:hover": {
      backgroundColor: theme.colors.palette[theme.isDarkModeEnabled ? "dark" : "light"].greyVariant2 + "30",
    },
  },
  selectedSidebarText: {
    padding: `${theme.spacing(1)}px ${theme.spacing(4)}px`,
    cursor: "pointer",
    backgroundColor: theme.colors.palette.focus.light + "14",
  },
  hr: {
    margin: `${theme.spacing(1)}px 0`,
  },
  link: {
    textDecoration: "none",
  },
}));

export default Settings;
