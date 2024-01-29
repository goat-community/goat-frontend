import Container from "@/components/map/panels/Container";
import { setActiveLeftPanel } from "@/lib/store/map/slice";
import { useAppDispatch } from "@/hooks/store/ContextHooks";
import { Legend } from "@/components/map/controls/Legend";
import type { PanelProps } from "@/types/map/sidebar";
import { useSortedLayers } from "@/hooks/map/LayerPanelHooks";
import { useMemo } from "react";

const LegendPanel = ({ projectId }: PanelProps) => {
  const dispatch = useAppDispatch();
  const sortedLayers = useSortedLayers(projectId);
  const visibleLayers = useMemo(
    () =>
      sortedLayers?.filter((layer) => {
        return layer.properties?.visibility;
      }),
    [sortedLayers],
  );
  return (
    <Container
      title="Legend"
      close={() => dispatch(setActiveLeftPanel(undefined))}
      direction="left"
      body={sortedLayers && <Legend layers={visibleLayers} />}
    />
  );
};

export default LegendPanel;
