import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

import { useTranslation } from "@/i18n/client";

import { useProjectLayers } from "@/lib/api/projects";
import { computeHeatmapGravity } from "@/lib/api/tools";
import type { LayerFieldType } from "@/lib/validations/layer";
import { heatmapGravitySchema, heatmapImpedanceFunctionEnum } from "@/lib/validations/tools";

import type { SelectorItem } from "@/types/map/common";
import type { IndicatorBaseProps } from "@/types/map/toolbox";

import Selector from "@/components/map/panels/common/Selector";
import HeatmapContainer from "@/components/map/panels/toolbox/common/HeatmapContainer";
import HeatmapOpportunitiesSelector from "@/components/map/panels/toolbox/common/HeatmapOpportunitiesSelector";

type Opportunity = {
  layer: SelectorItem | undefined;
  maxTravelTime: SelectorItem | undefined;
  sensitivity: number | undefined;
  destinationPotentialColumn: LayerFieldType | undefined;
};

const HeatmapGravity = ({ onBack, onClose }: IndicatorBaseProps) => {
  const { t } = useTranslation("common");
  const { projectId } = useParams();
  const { layers } = useProjectLayers(projectId as string);
  const defaultImpedanceFunction = {
    value: heatmapImpedanceFunctionEnum.Enum.gaussian,
    label: t(heatmapImpedanceFunctionEnum.Enum.gaussian),
  };
  const [impedanceFunction, setImpedanceFunction] = useState<SelectorItem | undefined>(
    defaultImpedanceFunction
  );

  const impedanceFunctions = useMemo(() => {
    return heatmapImpedanceFunctionEnum.options.map((value) => {
      return {
        value: value,
        label: t(value),
      } as SelectorItem;
    });
  }, [t]);

  const defaultOpportunities = [
    {
      layer: undefined,
      maxTravelTime: {
        value: 20,
        label: "20 (Min)",
      },
      sensitivity: 300000,
      destinationPotentialColumn: undefined,
    },
  ];
  const [opportunities, setOpportunities] = useState<Opportunity[]>(defaultOpportunities);

  const isValid = useMemo(() => {
    return true;
  }, []);

  const handleRun = () => {
    const payload = {
      impedance_function: impedanceFunction?.value,
      opportunities: opportunities.map((opportunity) => {
        return {
          opportunity_layer_project_id:
            layers && layers.find((layer) => layer.id === opportunity.layer?.value)?.id,
          max_traveltime: opportunity.maxTravelTime?.value,
          sensitivity: opportunity.sensitivity,
        };
      }),
    };

    return {
      schema: heatmapGravitySchema,
      payload,
      apiCall: computeHeatmapGravity,
      type: "heatmap_gravity",
    };
  };

  const handleReset = () => {
    setImpedanceFunction(defaultImpedanceFunction);
    setOpportunities(defaultOpportunities);
  };

  return (
    <HeatmapContainer
      title={t("heatmap_gravity")}
      description={t("heatmap_gravity_description")}
      onBack={onBack}
      onClose={onClose}
      handleReset={handleReset}
      handleRun={handleRun}
      isValid={isValid}
      configChildren={
        <>
          <Selector
            selectedItems={impedanceFunction}
            setSelectedItems={(item: SelectorItem[] | SelectorItem | undefined) => {
              setImpedanceFunction(item as SelectorItem);
            }}
            items={impedanceFunctions}
            label={t("impedance_function")}
            tooltip={t("impedance_function_tooltip")}
          />
        </>
      }
      opportunitiesChildren={
        <>
          <HeatmapOpportunitiesSelector
            opportunities={opportunities}
            setOpportunities={setOpportunities}
            heatmapType="gravity"
          />
        </>
      }
    />
  );
};

export default HeatmapGravity;
