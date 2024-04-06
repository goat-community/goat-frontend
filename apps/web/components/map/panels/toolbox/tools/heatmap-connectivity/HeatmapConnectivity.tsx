import type { IndicatorBaseProps } from "@/types/map/toolbox";
import { useTranslation } from "@/i18n/client";
import HeatmapContainer from "@/components/map/panels/toolbox/common/HeatmapContainer";
import { heatmapConnectivitySchema } from "@/lib/validations/tools";
import { computeHeatmapConnectivity } from "@/lib/api/tools";
import type { SelectorItem } from "@/types/map/common";
import Selector from "@/components/map/panels/common/Selector";
import { getTravelCostConfigValues } from "@/components/map/panels/toolbox/tools/catchment-area/utils";
import { useState } from "react";
import { useLayerByGeomType } from "@/hooks/map/ToolsHooks";
import { useParams } from "next/navigation";
import { ICON_NAME } from "@p4b/ui/components/Icon";

const HeatmapConnectivity = ({ onBack, onClose }: IndicatorBaseProps) => {
  const { t } = useTranslation("common");
  const { projectId } = useParams();

  const defaultMaxTravelTime = {
    value: 20,
    label: "20 (Min)",
  };
  const [maxTravelTime, setMaxTravelTime] = useState<SelectorItem | undefined>(
    defaultMaxTravelTime,
  );
  const { filteredLayers } = useLayerByGeomType(
    ["feature"],
    ["polygon"],
    projectId as string,
  );
  const [referenceLayer, setReferenceLayer] = useState<
    SelectorItem | undefined
  >(undefined);

  const isValid = true;
  const handleRun = () => {
    const payload = {
      reference_area_layer_project_id: referenceLayer?.value,
      max_traveltime: maxTravelTime?.value,
    };

    return {
      schema: heatmapConnectivitySchema,
      payload,
      apiCall: computeHeatmapConnectivity,
    };
  };
  const handleReset = () => {
    setMaxTravelTime(defaultMaxTravelTime);
    setReferenceLayer(undefined);
  };

  return (
    <HeatmapContainer
      title={t("heatmap_connectivity")}
      description={t("heatmap_connectivity_description")}
      onBack={onBack}
      onClose={onClose}
      handleReset={handleReset}
      handleRun={handleRun}
      isValid={isValid}
      configChildren={
        <>
          {/* MAX TRAVEL TIME */}
          <Selector
            selectedItems={maxTravelTime}
            setSelectedItems={(
              item: SelectorItem[] | SelectorItem | undefined,
            ) => {
              setMaxTravelTime(item as SelectorItem);
            }}
            items={getTravelCostConfigValues(3, 30, "min")}
            label={t("travel_time_limit") + " (Min)"}
            tooltip={t("travel_time_limit_tooltip")}
          />
          <Selector
            selectedItems={referenceLayer}
            setSelectedItems={(
              item: SelectorItem[] | SelectorItem | undefined,
            ) => {
              setReferenceLayer(item as SelectorItem);
            }}
            items={filteredLayers}
            emptyMessage={t("no_polygon_layer_found")}
            emptyMessageIcon={ICON_NAME.LAYERS}
            label={t("select_reference_layer")}
            placeholder={t("select_reference_layer_placeholder")}
            tooltip={t("select_reference_layer_tooltip")}
          />
        </>
      }
    />
  );
};

export default HeatmapConnectivity;
