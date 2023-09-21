"use client";

import UserInfoMenu from "@/components/UserInfoMenu";
import {
  Chip,
  // Toolbar,
  useTheme,
  Typography,
  IconButton,
} from "@mui/material";
import Divider from "@mui/material/Divider";
import { ICON_NAME, Icon } from "@p4b/ui/components/Icon";
import { Toolbar } from "./Toolbar";

export type HeaderProps = {
  title: string;
  lastSaved?: string;
  tags?: string[];
  showHambugerMenu?: boolean;
  onMenuIconClick?: () => void;
  height: number;
};

export default function Header(props: HeaderProps) {
  const theme = useTheme();
  const { tags, title, lastSaved, onMenuIconClick, showHambugerMenu, height } =
    props;

  return (
    <Toolbar
      showHambugerMenu={showHambugerMenu}
      onMenuIconClick={onMenuIconClick}
      height={height}
      LeftToolbarChild={
        <>
          <Typography variant="body1" fontWeight="bold">
            {title}
          </Typography>
          <Divider orientation="vertical" flexItem />
          {lastSaved && (
            <Typography variant="body2" >Last saved: {lastSaved}</Typography>
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
        </>
      }
      RightToolbarChild={
        <>
          <IconButton
            size="small"
            onClick={() => {
              window.open("https://docs.goat.plan4better.de", "_blank");
            }}
          >
            <Icon iconName={ICON_NAME.HELP} fontSize="inherit" />
          </IconButton>
          <UserInfoMenu />
        </>
      }
    />
  );
}
