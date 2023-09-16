import type { CSSObject, Theme } from "@mui/material";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
  useTheme,
} from "@mui/material";

import { Icon, ICON_NAME } from "@p4b/ui/components/Icon";

export interface SidebarItem {
  link: string;
  icon: ICON_NAME;
  placeholder: string;
}

const sidebarItems: SidebarItem[] = [
  {
    link: "/home",
    icon: ICON_NAME.HOUSE,
    placeholder: "Home",
  },
  {
    link: "/content",
    icon: ICON_NAME.FOLDER,
    placeholder: "Content",
  },
  {
    link: "/settings",
    icon: ICON_NAME.SETTINGS,
    placeholder: "Settings",
  },
  {
    //todo change test to id logic
    link: "/map/test",
    icon: ICON_NAME.STYLE,
    placeholder: "Styling",
  },
];

const openedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
});

interface Props {
  hidden: boolean;
  collapsedWidth: number;
  width: number;
  navVisible: boolean;
  setNavVisible: (value: boolean) => void;
}

const DashboardSidebar = (props: Props) => {
  const { hidden, width, collapsedWidth, navVisible, setNavVisible } = props;
  const theme = useTheme();

  const MobileDrawerProps = {
    open: navVisible,
    onOpen: () => setNavVisible(true),
    onClose: () => setNavVisible(false),
    ModalProps: {
      keepMounted: true,
    },
  };

  const DesktopDrawerProps = {
    open: navVisible,
    onOpen: () => null,
    onClose: () => null,
  };

  return (
    <SwipeableDrawer
      variant={hidden ? "temporary" : "permanent"}
      {...(hidden ? { ...MobileDrawerProps } : { ...DesktopDrawerProps })}
      open={navVisible}
      onMouseEnter={() => {
        if (!hidden) setNavVisible(true);
      }}
      onMouseLeave={() => {
        if (!hidden) setNavVisible(false);
      }}
      sx={{
        width: hidden ? width : collapsedWidth,
        zIndex: (theme) =>
          hidden ? theme.zIndex.drawer + 2 : theme.zIndex.drawer,
        "& .MuiPaper-root": {
          ...(!hidden && {
            width: navVisible ? width : collapsedWidth,
          }),
          ...(navVisible && {
            ...openedMixin(theme),
          }),
          ...(!navVisible && {
            ...closedMixin(theme),
          }),
          position: "relative",
          overflow: "hidden",
          backgroundColor: theme.palette.background.paper,
          borderRight: "1px solid rgba(58, 53, 65, 0.12)"
        },
      }}
    >
      <List>
        {sidebarItems.map((item) => (
          <ListItem key={item.icon} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              sx={{
                minHeight: 48,
              }}
              onClick={() => {
                console.log("click");
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
                <Icon iconName={item.icon} fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={item.placeholder} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </SwipeableDrawer>
  );
};

export default DashboardSidebar;
