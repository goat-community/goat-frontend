"use client";

import UserInfoMenu from "@/components/UserInfoMenu";
import {
  AppBar,
  Box,
  Chip,
  Stack,
  Toolbar,
  useTheme,
  Typography,
  IconButton,
} from "@mui/material";
import Divider from "@mui/material/Divider";
import { ICON_NAME, Icon } from "@p4b/ui/components/Icon";
import { GOATLogoIconOnlyGreen } from "@p4b/ui/assets/svg/GOATLogoIconOnlyGreen";
import Link from "next/link";

export type HeaderProps = {
  title: string;
  lastSaved?: string;
  tags?: string[];
  showHambugerMenu?: boolean;
  onMenuIconClick?: () => void;
  height?: number;
};

export default function Header(props: HeaderProps) {
  const theme = useTheme();
  const { tags, title, lastSaved, onMenuIconClick, showHambugerMenu } = props;

  return (
    <AppBar
      position="relative"
      elevation={0}
      color="primary"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer,
        borderBottom: "1px solid rgba(58, 53, 65, 0.12)",
      }}
    >
      <Toolbar
        variant="dense"
        sx={{ minHeight: props.height, height: props.height }}
      >
        {showHambugerMenu && (
          <>
            <IconButton onClick={onMenuIconClick}>
              <Icon iconName={ICON_NAME.HAMBURGER_MENU} fontSize="inherit" />
            </IconButton>

            <Divider orientation="vertical" flexItem sx={{ ml: 2, mr: 3 }} />
          </>
        )}

        <Link
          href="/home"
          style={{
            width: "35px",
            height: "35px",
            cursor: "pointer",
          }}
        >
          <Box
            sx={{
              transition: "transform 0.2s ease-in-out",
              "&:hover": {
                transform: "scale(1.1)",
              },
            }}
          >
            <GOATLogoIconOnlyGreen />
          </Box>
        </Link>
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            mx: theme.spacing(4),
          }}
        >
          <Typography variant="body1" fontWeight="bold">
            {title}
          </Typography>
          <Divider orientation="vertical" flexItem />
          {lastSaved && (
            <Typography variant="body2">Last saved: {lastSaved}</Typography>
          )}
          {tags &&
            tags.map((tag) => (
              <Chip
                variant="outlined"
                label={tag}
                key={tag}
                sx={{
                  mx: theme.spacing(1),
                }}
              />
            ))}
        </Stack>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton
          size="small"
          onClick={() => {
            window.open("https://docs.goat.plan4better.de", "_blank");
          }}
        >
          <Icon iconName={ICON_NAME.HELP} fontSize="inherit" />
        </IconButton>
        <UserInfoMenu />
      </Toolbar>
    </AppBar>
  );
}
