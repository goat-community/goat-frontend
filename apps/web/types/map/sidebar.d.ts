import type { ICON_NAME } from "@p4b/ui/components/Icon";

export type MapSidebarItem = {
  icon: ICON_NAME;
  name: string;
  component?: JSX.Element;
  link?: string;
};