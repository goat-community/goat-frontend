import { ArrowPopper } from "@/components/ArrowPoper";
import {
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  useTheme,
} from "@mui/material";
import { ICON_NAME } from "@p4b/ui/components/Icon";
import { Icon } from "@p4b/ui/components/Icon";
import { useState } from "react";

export interface MoreMenuItem {
  label: string;
  icon: ICON_NAME;
  color?: string;
  onClick?: () => void;
}

export interface MoreMenuProps {
  menuItems: MoreMenuItem[];
  menuIcon?: React.ReactNode;
}

export default function MoreMenu(props: MoreMenuProps) {
  const { menuItems, menuIcon } = props;
  const theme = useTheme();
  const [moreMenuOpen, setMoreMenuOpen] = useState<boolean>(false);

  return (
    <ArrowPopper
      open={moreMenuOpen}
      placement="bottom"
      onClose={() => setMoreMenuOpen(false)}
      arrow={false}
      content={
        <Paper
          elevation={8}
          sx={{
            minWidth: 220,
            maxWidth: 340,
            overflow: "auto",
            py: theme.spacing(2),
          }}
        >
          <List dense={true} disablePadding>
            {menuItems.map((item, index) => (
              <ListItemButton
                key={index}
                onClick={() => {
                  item.onClick?.();
                  setMoreMenuOpen(false);
                }}
                sx={{
                  ...(item.color && {
                    color: item.color,
                  }),
                }}
              >
                <ListItemIcon
                  sx={{
                    color: item.color || "inherit",
                    pr: 4,
                    minWidth: 0,
                  }}
                >
                  <Icon
                    style={{ fontSize: 15 }}
                    iconName={item.icon}
                    htmlColor={item.color || "inherit"}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{
                    "& .MuiTypography-root": {
                      ...(item.color && {
                        color: item.color,
                      }),
                    },
                  }}
                />
              </ListItemButton>
            ))}
          </List>
        </Paper>
      }
    >
      <IconButton
        size="medium"
        onClick={(event) => {
          event.stopPropagation();
          setMoreMenuOpen(!moreMenuOpen);
        }}
      >
        {menuIcon || <Icon iconName={ICON_NAME.MORE_VERT} fontSize="small" />}
      </IconButton>
    </ArrowPopper>
  );
}