"use client";

import React from "react";
import {
  Typography,
  useTheme,
  Box,
  Divider,
  Container,
  Grid,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, ICON_NAME } from "@p4b/ui/components/Icon";

interface SettingsLayoutProps {
  children: React.ReactNode;
}

const SettingsLayout = (props: SettingsLayoutProps) => {
  const { children } = props;

  const pathname = usePathname();
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const linkStyle = (page) =>
    pathname.slice(3) === `/settings/${page}`
      ? {
          cursor: "pointer",
          backgroundColor: theme.palette.primary.light + "14",
          padding: `${theme.spacing(1)} ${theme.spacing(4)}`,
        }
      : {
          cursor: "pointer",
          "&:hover": {
            backgroundColor: theme.palette.secondary.light + "50",
          },
          padding: `${theme.spacing(1)} ${theme.spacing(4)}`,
        };

  return (
    <Box>
      <Container
        sx={{
          py: 20,
          px: 10,
        }}
        maxWidth="xl"
      >
        <Box>
          <IconButton
            sx={{
              float: "right",
              [theme.breakpoints.up("md")]: {
                display: "none",
              },
            }}
            onClick={handleClick}
          >
            <Icon
              iconName={ICON_NAME.MORE_VERT}
              sx={{
                backgroundColor: `${theme.palette.secondary.main}80`,
                fontSize: theme.typography.h4,
                padding: theme.spacing(1),
                borderRadius: "100%",
              }}
            />
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <Link
              href="/settings/organization"
              style={{ textDecoration: "none" }}
            >
              <MenuItem onClick={handleClose}>Organization</MenuItem>
            </Link>
            <Link
              href="/settings/subscription"
              style={{ textDecoration: "none" }}
            >
              <MenuItem onClick={handleClose}>Subscription</MenuItem>
            </Link>
            <Link href="/settings/settings" style={{ textDecoration: "none" }}>
              <MenuItem onClick={handleClose}>Settings</MenuItem>
            </Link>
          </Menu>
        </Box>
        <Grid container justifyContent="space-between">
          <Grid
            item
            xs={2.5}
            sx={{
              [theme.breakpoints.down("md")]: {
                display: "none",
              },
            }}
          >
            <div>
              <Link
                href="/settings/organization"
                style={{ textDecoration: "none" }}
              >
                <Box sx={linkStyle("organization")}>
                  <Typography variant="body2">Organization</Typography>
                </Box>
              </Link>
              <Divider sx={{ margin: `4px 0`, width: "100%" }} />
              <Link
                href="/settings/subscription"
                style={{ textDecoration: "none" }}
              >
                <Box sx={linkStyle("subscription")}>
                  <Typography variant="body2">Subscription</Typography>
                </Box>
              </Link>
              <Divider sx={{ margin: `4px 0`, width: "100%" }} />
              <Link
                href="/settings/settings"
                style={{ textDecoration: "none" }}
              >
                <Box sx={linkStyle("settings")}>
                  <Typography variant="body2">Settings</Typography>
                </Box>
              </Link>
              <Divider sx={{ margin: `4px 0`, width: "100%" }} />
            </div>
          </Grid>
          <Grid item xs={12} md={9}>
            <div>{children}</div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default SettingsLayout;
