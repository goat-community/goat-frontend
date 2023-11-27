import type { PopperMenuItem } from "@/components/common/PopperMenu";
import { useTranslation } from "@/i18n/client";
import type { Layer as ProjectLayer } from "@/lib/validations/layer";
import { ContentActions, MapLayerActions } from "@/types/common";
import { ICON_NAME } from "@p4b/ui/components/Icon";
import { useState } from "react";

export const useLayerSettingsMoreMenu = () => {
  const { t } = useTranslation(["map", "common"]);
  const layerMoreMenuOptions: PopperMenuItem[] = [
    {
      id: ContentActions.INFO,
      label: t("common:info"),
      icon: ICON_NAME.CIRCLEINFO,
    },
    {
      id: MapLayerActions.DUPLICATE,
      label: t("maps:duplicate"),
      icon: ICON_NAME.COPY,
    },
    {
      id: MapLayerActions.RENAME,
      label: t("common:rename"),
      icon: ICON_NAME.EDIT,
    },
    {
      id: ContentActions.DELETE,
      label: t("common:remove"),
      icon: ICON_NAME.TRASH,
      color: "error.main",
    },
  ];

  const [activeLayer, setActiveLayer] = useState<ProjectLayer>();
  const [moreMenuState, setMoreMenuState] = useState<PopperMenuItem>();

  const closeMoreMenu = () => {
    setActiveLayer(undefined);
    setMoreMenuState(undefined);
  };

  const openMoreMenu = (menuItem: PopperMenuItem, layerItem: ProjectLayer) => {
    setActiveLayer(layerItem);
    setMoreMenuState(menuItem);
  };

  return {
    layerMoreMenuOptions,
    activeLayer,
    moreMenuState,
    closeMoreMenu,
    openMoreMenu,
  };
};
