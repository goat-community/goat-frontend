import { useAppSelector } from "@/hooks/store/ContextHooks";
import { useTranslation } from "@/i18n/client";
import { useProject, useProjectLayers } from "@/lib/api/projects";
import { ContentActions, MapLayerActions } from "@/types/common";
import { ICON_NAME } from "@p4b/ui/components/Icon";
import { useMemo, useState } from "react";

import type { PopperMenuItem } from "@/components/common/PopperMenu";
import type { ProjectLayer } from "@/lib/validations/project";

export const useLayerSettingsMoreMenu = () => {
  const { t } = useTranslation(["maps", "common"]);
  const layerMoreMenuOptions: PopperMenuItem[] = [
    {
      id: MapLayerActions.PROPERTIES,
      label: t("common:properties"),
      icon: ICON_NAME.CIRCLEINFO,
    },
    {
      id: MapLayerActions.ZOOM_TO,
      label: t("maps:zoom_to"),
      icon: ICON_NAME.ZOOM_IN,
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

export const useActiveLayer = (projectId: string) => {
  const { layers: projectLayers, mutate } = useProjectLayers(projectId);
  const activeLayerId = useAppSelector((state) => state.layers.activeLayerId);
  const activeLayer = useMemo(
    () =>
      projectLayers?.find((layer) => layer.id === activeLayerId) ?? undefined,
    [activeLayerId, projectLayers],
  );
  return { activeLayer, mutate };
};

export const useSortedLayers = (projectId: string) => {
  const { layers: projectLayers } = useProjectLayers(projectId);
  const { project } = useProject(projectId);
  const sortedLayers = useMemo(() => {
    if (!projectLayers || !project) return [];
    return projectLayers.sort(
      (a, b) =>
        project?.layer_order.indexOf(a.id) - project.layer_order.indexOf(b.id),
    );
  }, [projectLayers, project]);
  return sortedLayers;
};

// export const useOptionsStatistics = (expressions: Expression[]) => {
//   const [data, _] = useState();
//   const [optionsStatistics, setOptionsStatistics] = useState();

//   if (expressions) {
//     expressions.map((expression) => {
//       const optionsStatistic = Object.keys(data ? data : {}).map((option) => ({
//         value: option,
//         label: option,
//       }));

//       setOptionsStatistics([
//         optionsStatistic,
//         {
//           id: expression.id,
//           optionsStatistic: optionsStatistic,
//         },
//       ]);
//     });
//   }

//   console.log(optionsStatistics)

//   return { optionsStatistics };
// };
