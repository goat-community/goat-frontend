"use client";

import {
  Typography,
  useTheme,
  Box,
  Divider,
  Container,
  Grid,
} from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SettingsLayoutProps {
  children: React.ReactNode;
}

const SettingsLayout = (props: SettingsLayoutProps) => {
  const { children } = props;

  const pathname = usePathname();
  console.log(pathname);
  const theme = useTheme();

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
      <Container sx={{ py: 20, px: 10 }} maxWidth="xl">
        <Grid container justifyContent="space-between">
          <Grid item xs={2.5}>
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
          <Grid item xs={9}>
            <div>{children}</div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default SettingsLayout;
