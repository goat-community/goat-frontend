import { useAppSelector } from "@/hooks/store/ContextHooks";
import { useTranslation } from "@/i18n/client";
import { useProject, useProjectLayers } from "@/lib/api/projects";
import {
  featureLayerLinePropertiesSchema,
  featureLayerPointPropertiesSchema,
  featureLayerPolygonPropertiesSchema,
} from "@/lib/validations/layer";
import {
  projectLayerSchema,
  type ProjectLayer,
} from "@/lib/validations/project";
import { ContentActions, MapLayerActions } from "@/types/common";
import { ICON_NAME } from "@p4b/ui/components/Icon";
import { useMemo, useState } from "react";

import type { PopperMenuItem } from "@/components/common/PopperMenu";

export const useLayerSettingsMoreMenu = () => {
  const { t } = useTranslation(["maps", "common"]);

  function getLayerMoreMenuOptions(
    layerType: ProjectLayer["type"],
  ): PopperMenuItem[] {
    if (layerType === "feature") {
      const featureOptions: PopperMenuItem[] = [
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
          id: ContentActions.TABLE,
          label: t("maps:open_data_table"),
          icon: ICON_NAME.TABLE,
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
          id: ContentActions.DOWNLOAD,
          label: t("maps:download"),
          icon: ICON_NAME.DOWNLOAD,
        },
        {
          id: ContentActions.DELETE,
          label: t("common:remove"),
          icon: ICON_NAME.TRASH,
          color: "error.main",
        },
      ];
      return featureOptions;
    }
    if (layerType === "table") {
      const tableOptions = [
        {
          id: MapLayerActions.PROPERTIES,
          label: t("common:properties"),
          icon: ICON_NAME.CIRCLEINFO,
        },
        {
          id: ContentActions.TABLE,
          label: t("maps:open_data_table"),
          icon: ICON_NAME.TABLE,
        },
        {
          id: MapLayerActions.RENAME,
          label: t("common:rename"),
          icon: ICON_NAME.EDIT,
        },
        {
          id: ContentActions.DOWNLOAD,
          label: t("maps:download"),
          icon: ICON_NAME.DOWNLOAD,
        },
        {
          id: ContentActions.DELETE,
          label: t("common:remove"),
          icon: ICON_NAME.TRASH,
          color: "error.main",
        },
      ];

      return tableOptions;
    }

    return [];
  }

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
    getLayerMoreMenuOptions,
    activeLayer,
    moreMenuState,
    closeMoreMenu,
    openMoreMenu,
  };
};

export const useActiveLayer = (projectId: string) => {
  const { layers: projectLayers, mutate } = useProjectLayers(projectId);
  const activeLayerId = useAppSelector((state) => state.layers.activeLayerId);
  const activeLayer = useMemo(() => {
    const activeLayer = projectLayers?.find(
      (layer) => layer.id === activeLayerId,
    );
    if (!activeLayer) return undefined;
    const properties = activeLayer?.properties;
    if (!properties) return undefined;
    const parsedActiveLayer = projectLayerSchema.parse(activeLayer);
    if (parsedActiveLayer.feature_layer_geometry_type === "point") {
      parsedActiveLayer.properties =
        featureLayerPointPropertiesSchema.parse(properties);
    }
    if (parsedActiveLayer.feature_layer_geometry_type === "line") {
      parsedActiveLayer.properties =
        featureLayerLinePropertiesSchema.parse(properties);
    }

    if (parsedActiveLayer.feature_layer_geometry_type === "polygon") {
      parsedActiveLayer.properties =
        featureLayerPolygonPropertiesSchema.parse(properties);
    }

    return parsedActiveLayer;
  }, [activeLayerId, projectLayers]);
  return { activeLayer, mutate };
};

export const useFilterQueries = (projectId: string) => {
  const { layers: projectLayers, mutate } = useProjectLayers(projectId);
  const activeLayerId = useAppSelector((state) => state.layers.activeLayerId);
  const activeLayer = projectLayers?.find(
    (layer) => layer.id === activeLayerId,
  );

  return { activeLayer, mutate };
};

export const useSortedLayers = (projectId: string) => {
  const { layers: projectLayers } = useProjectLayers(projectId);
  const { project } = useProject(projectId);
  const sortedLayers = useMemo(() => {
    if (!projectLayers || !project) return [];
    if (!project.layer_order) return projectLayers;
    return projectLayers.sort(
      (a, b) =>
        project?.layer_order.indexOf(a.id) - project.layer_order.indexOf(b.id),
    );
  }, [projectLayers, project]);
  return sortedLayers;
};
