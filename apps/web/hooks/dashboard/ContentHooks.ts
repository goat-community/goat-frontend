import { PopperMenuItem } from "@/components/common/PopperMenu";
import { ContentActions } from "@/types/common";
import type { Layer } from "@/lib/validations/layer";
import type { Project } from "@/lib/validations/project";
import { ICON_NAME } from "@p4b/ui/components/Icon";
import { useState } from "react";

export const useContentMoreMenu = () => {
  const moreMenuOptions: PopperMenuItem[] = [
    {
      id: ContentActions.INFO,
      label: "Info",
      icon: ICON_NAME.CIRCLEINFO,
    },
    {
      id: ContentActions.EDIT_METADATA,
      label: "Edit metadata",
      icon: ICON_NAME.EDIT,
    },
    {
      id: ContentActions.MOVE_TO_FOLDER,
      label: "Move to folder",
      icon: ICON_NAME.FOLDER,
    },
    {
      id: ContentActions.DOWNLOAD,
      label: "Download",
      icon: ICON_NAME.DOWNLOAD,
    },
    {
      id: ContentActions.SHARE,
      label: "Share",
      icon: ICON_NAME.SHARE,
    },
    {
      id: ContentActions.DELETE,
      label: "Delete",
      icon: ICON_NAME.TRASH,
      color: "error.main",
    },
  ];

  const [activeContent, setActiveContent] = useState<Project | Layer>();
  const [moreMenuState, setMoreMenuState] = useState<PopperMenuItem>();

  const closeMoreMenu = () => {
    setActiveContent(undefined);
    setMoreMenuState(undefined);
  };

  const openMoreMenu = (
    menuItem: PopperMenuItem,
    contentItem: Project | Layer,
  ) => {
    setActiveContent(contentItem);
    setMoreMenuState(menuItem);
  };

  return {
    moreMenuOptions,
    activeContent,
    moreMenuState,
    closeMoreMenu,
    openMoreMenu,
  };
};
