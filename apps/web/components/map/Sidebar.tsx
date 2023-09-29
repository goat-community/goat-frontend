"use client";

import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Tooltip,
  useTheme,
} from "@mui/material";
import type { CSSProperties } from "react";

import { Icon } from "@p4b/ui/components/Icon";
import type { MapSidebarItem } from "@/types/map/sidebar";

export type MapSidebarProps = {
  className?: string;
  topItems?: MapSidebarItem[];
  centerItems?: MapSidebarItem[];
  bottomItems?: MapSidebarItem[];
  width: number;
  position: "left" | "right";
  active?: MapSidebarItem;
  onClick?: (active: MapSidebarItem) => void;
};

const MapSidebarList = (props: MapSidebarListProps) => {
  const { items, justifyContent, sidebarPosition, active, sidebarWidth } = props;
  const theme = useTheme();

  const htmlColor = (name: string) => {
    if (name === active?.name) {
      return theme.palette.primary.main;
    }
    return theme.palette.text.secondary
  };

  return (
    <List
      sx={{
        justifyContent,
        display: "flex",
        width: sidebarWidth,
        flexDirection: "column",
        padding: 0,
      }}
    >
      {items.map((item) => (
        <Tooltip
          key={`${item.icon}_tooltip`}
          title={item.name}
          arrow
          placement={sidebarPosition == "left" ? "right" : "left"}
        >
          <ListItem
            key={item.icon}
            disablePadding
            disableGutters
            sx={{
              display: "block",
            }}
          >
            <ListItemButton
              sx={{
                minHeight: 60,
                justifyContent: "center",
                "&:hover": {
                  backgroundColor: theme.palette.background.default,
                },
              }}
              onClick={() => {
                if (props.onClick) {
                  props.onClick(item);
                }
              }}
            >
              <ListItemIcon
                sx={{ minWidth: 0, mr: "auto", justifyContent: "center" }}
              >
                <Icon
                  iconName={item.icon}
                  htmlColor={htmlColor(item.name)}
                  fontSize="small"
                />
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
        </Tooltip>
      ))}
    </List>
  );
};

export type MapSidebarListProps = {
  items: MapSidebarItem[];
  justifyContent: CSSProperties["justifyContent"];
  sidebarPosition: MapSidebarProps["position"];
  active?: MapSidebarItem;
  sidebarWidth: number;
  onClick?: (active: MapSidebarItem) => void;
};

export default function MapSidebar(props: MapSidebarProps) {

  const {width} = props;

  return (
    <Drawer
      variant="permanent"
      open={false}
      anchor={props.position}
      sx={{
        ".MuiDrawer-paper": {
          flexShrink: 0,
          whiteSpace: "nowrap",
          border: "none",
          width: width,
          overflowX: "hidden",
          overflowY: "hidden",
          boxSizing: "border-box",
        },
      }}
    > 
      <Box
        sx={{
          display: "grid",
          height: "100%",
          gridTemplateRows: "repeat(3, 1fr)",
          justify: "center",
        }}
      >
        <MapSidebarList
          items={props.topItems ?? []}
          active={props.active}
          sidebarWidth={width}
          justifyContent="flex-start"
          sidebarPosition={props.position}
          onClick={props.onClick}
        />
        <MapSidebarList
          items={props.centerItems ?? []}
          active={props.active}
          sidebarWidth={width}
          justifyContent="center"
          sidebarPosition={props.position}
          onClick={props.onClick}
        />
        <MapSidebarList
          items={props.bottomItems ?? []}
          active={props.active}
          sidebarWidth={width}
          justifyContent="flex-end"
          sidebarPosition={props.position}
          onClick={props.onClick}
        />
      </Box>
    </Drawer>
  );
}
