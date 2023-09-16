import { ArrowPopper } from "@/components/ArrowPoper";
import {
  Avatar,
  Divider,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  useTheme,
  Typography,
} from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

import { Icon, ICON_NAME } from "@p4b/ui/components/Icon";
import { useOrganization } from "@/lib/api/users";

export default function UserInfoMenu() {
  const { data: session } = useSession();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const { organization } = useOrganization();
  return (
    <>
      <Divider
        orientation="vertical"
        sx={{ mx: 2, height: "75%" }}
        variant="middle"
      />
      <ArrowPopper
        content={
          <Paper
            sx={{
              width: 240,
              overflow: "auto",
              py: theme.spacing(2),
            }}
          >
            <Stack
              spacing={2}
              sx={{
                pt: theme.spacing(2),
              }}
            >
              <Stack
                sx={{ px: theme.spacing(4), pb: theme.spacing(2) }}
                spacing={3}
              >
                <Stack
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="center"
                  spacing={2}
                >
                  <Avatar sx={{ bgcolor: "rgba(71, 219, 153, 0.12)" }}>
                    <Icon
                      iconName={ICON_NAME.ORGANIZATION}
                      htmlColor={theme.palette.primary.main}
                      fontSize="medium"
                    />
                  </Avatar>
                  <Typography variant="body1" fontWeight="bold">
                    {organization?.name ?? "Organization"}
                  </Typography>
                </Stack>
                <Typography variant="body1" gutterBottom>
                  {session?.user?.name || "Username"}
                </Typography>
                <Typography variant="caption">
                  {session?.user?.user_roles &&
                  session.user.user_roles.length > 0
                    ? session.user.user_roles[0]
                    : "User"}
                </Typography>
              </Stack>
              <Divider />
              <ListItemButton
                onClick={() => signOut()}
                sx={{
                  color: theme.palette.error.main,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 35,
                    color: "inherit",
                  }}
                >
                  <Icon
                    iconName={ICON_NAME.SIGNOUT}
                    fontSize="small"
                    fontWeight="light"
                    htmlColor="inherit"
                  />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      color="inherit"
                      fontWeight="bold"
                    >
                      Logout
                    </Typography>
                  }
                />
              </ListItemButton>
            </Stack>
          </Paper>
        }
        open={open}
        placement="bottom"
        onClose={() => setOpen(false)}
      >
        <IconButton
          onClick={() => {
            setOpen(!open);
          }}
          size="small"
        >
          {session?.user?.image ? (
            <Avatar
              sx={{ width: 36, height: 36 }}
              alt={session?.user?.name || "User"}
              src={session.user.image}
            />
          ) : (
            <Avatar
              sx={{ width: 36, height: 36 }}
              alt={session?.user?.name || "User"}
            >
              <Icon
                fontSize="inherit"
                iconName={ICON_NAME.USER}
                htmlColor="inherit"
              />
            </Avatar>
          )}
        </IconButton>
      </ArrowPopper>
    </>
  );
}
