import HeatmapContainer from "@/components/map/panels/toolbox/common/HeatmapContainer";
import type { Opportunity } from "@/components/map/panels/toolbox/common/HeatmapOpportunitiesSelector";
import HeatmapOpportunitiesSelector from "@/components/map/panels/toolbox/common/HeatmapOpportunitiesSelector";
import { useTranslation } from "@/i18n/client";
import { useProjectLayers } from "@/lib/api/projects";
import { computeHeatmapClosestAverage } from "@/lib/api/tools";
import { heatmapClosestAverageSchema } from "@/lib/validations/tools";
import type { IndicatorBaseProps } from "@/types/map/toolbox";
import { useParams } from "next/navigation";
import { useState } from "react";

const HeatmapClosestAverage = ({ onBack, onClose }: IndicatorBaseProps) => {
  const { t } = useTranslation("common");
  const { projectId } = useParams();
  const { layers } = useProjectLayers(projectId as string);

  const defaultOpportunities: Opportunity[] = [
    {
      layer: undefined,
      maxTravelTime: {
        value: 20,
        label: "20 (Min)",
      },
      numberOfDestinations: {
        value: 1,
        label: "1",
      },
    },
  ];
  const [opportunities, setOpportunities] =
    useState<Opportunity[]>(defaultOpportunities);

  const handleReset = () => {
    setOpportunities(defaultOpportunities);
  };

  const handleRun = () => {
    const payload = {
      opportunities: opportunities.map((opportunity) => {
        return {
          opportunity_layer_project_id:
            layers &&
            layers.find((layer) => layer.id === opportunity.layer?.value)?.id,
          max_traveltime: opportunity.maxTravelTime?.value,
          number_of_destinations: opportunity.numberOfDestinations?.value,
        };
      }),
    };

    return {
      schema: heatmapClosestAverageSchema,
      payload,
      apiCall: computeHeatmapClosestAverage,
      type: "heatmap_closest_average",
    };
  };

  const isValid = true;
  return (
    <HeatmapContainer
      title={t("heatmap_closest_average")}
      description={t("heatmap_closest_average_description")}
      onBack={onBack}
      onClose={onClose}
      handleReset={handleReset}
      handleRun={handleRun}
      isValid={isValid}
      opportunitiesChildren={
        <HeatmapOpportunitiesSelector
          opportunities={opportunities}
          setOpportunities={setOpportunities}
          heatmapType="closest_average"
        />
      }
    />
  );
};

export default HeatmapClosestAverage;
