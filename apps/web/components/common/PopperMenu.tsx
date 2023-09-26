import { ArrowPopper } from "@/components/ArrowPoper";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  useTheme,
} from "@mui/material";
import type { ICON_NAME } from "@p4b/ui/components/Icon";
import { Icon } from "@p4b/ui/components/Icon";
import { useState } from "react";

export interface PopperMenuItem {
  label: string;
  icon?: ICON_NAME;
  color?: string;
}

export interface PopperMenuProps {
  menuItems: PopperMenuItem[];
  selectedItem?: PopperMenuItem;
  menuButton: React.ReactNode;
  onSelect: (index: number) => void;
}

export default function PopperMenu(props: PopperMenuProps) {
  const { menuItems, menuButton, selectedItem } = props;
  const theme = useTheme();
  const [popperMenuOpen, setPopperMenuOpen] = useState<boolean>(false);

  return (
    <ArrowPopper
      open={popperMenuOpen}
      placement="bottom"
      onClose={() => setPopperMenuOpen(false)}
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
                selected={selectedItem?.label === item.label}
                key={index}
                onClick={() => {
                  props.onSelect(index);
                  setPopperMenuOpen(false);
                }}
                sx={{
                  ...(item.color && {
                    color: item.color,
                  }),
                }}
              >
                {item.icon && (
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
                )}
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
      <div
        onClick={(event) => {
          event.stopPropagation();
          setPopperMenuOpen(!popperMenuOpen);
        }}
      >
        {menuButton}
      </div>
    </ArrowPopper>
  );
}
