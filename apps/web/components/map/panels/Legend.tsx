import { useMemo } from "react";

import { useTranslation } from "@/i18n/client";

import { setActiveLeftPanel } from "@/lib/store/map/slice";

import type { PanelProps } from "@/types/map/sidebar";

import { useFilteredProjectLayers } from "@/hooks/map/LayerPanelHooks";
import { useAppDispatch } from "@/hooks/store/ContextHooks";

import { Legend } from "@/components/map/controls/Legend";
import Container from "@/components/map/panels/Container";

const LegendPanel = ({ projectId }: PanelProps) => {
  const { t } = useTranslation("common");
  const dispatch = useAppDispatch();
  const { layers: projectLayers } = useFilteredProjectLayers(projectId);
  const visibleLayers = useMemo(
    () =>
      projectLayers?.filter((layer) => {
        return layer.properties?.visibility;
      }),
    [projectLayers]
  );
  return (
    <Container
      title={t("legend")}
      close={() => dispatch(setActiveLeftPanel(undefined))}
      direction="left"
      body={projectLayers && <Legend layers={visibleLayers} hideZoomLevel />}
    />
  );
};

export default LegendPanel;
