import { useTranslation } from "@/i18n/client";
import { useProjectLayers } from "@/lib/api/projects";
import type { LayerFieldType } from "@/lib/validations/layer";
import {
  CatchmentAreaRoutingTypeEnum,
  HeatmapRoutingTypeEnum,
  PTDay,
  PTRoutingModes,
  catchmentAreaConfigDefaults,
  catchmentAreaShapeEnum,
  statisticOperationEnum,
} from "@/lib/validations/tools";
import type { SelectorItem } from "@/types/map/common";
import { ICON_NAME } from "@p4b/ui/components/Icon";
import { useCallback, useEffect, useMemo, useState } from "react";

export const usePTTimeSelectorValues = () => {
  const { t } = useTranslation("common");
  const ptModes: SelectorItem[] = useMemo(() => {
    return [
      {
        value: PTRoutingModes.Enum.bus,
        label: t("routing_modes.bus"),
        icon: ICON_NAME.BUS,
      },
      {
        value: PTRoutingModes.Enum.tram,
        label: t("routing_modes.tram"),
        icon: ICON_NAME.TRAM,
      },
      {
        value: PTRoutingModes.Enum.rail,
        label: t("routing_modes.rail"),
        icon: ICON_NAME.RAIL,
      },
      {
        value: PTRoutingModes.Enum.subway,
        label: t("routing_modes.subway"),
        icon: ICON_NAME.SUBWAY,
      },
      {
        value: PTRoutingModes.Enum.ferry,
        label: t("routing_modes.ferry"),
        icon: ICON_NAME.FERRY,
      },
      {
        value: PTRoutingModes.Enum.cable_car,
        label: t("routing_modes.cable_car"),
        icon: ICON_NAME.CABLE_CAR,
      },
      {
        value: PTRoutingModes.Enum.gondola,
        label: t("routing_modes.gondola"),
        icon: ICON_NAME.GONDOLA,
      },
      {
        value: PTRoutingModes.Enum.funicular,
        label: t("routing_modes.funicular"),
        icon: ICON_NAME.FUNICULAR,
      },
    ];
  }, [t]);

  const ptDays: SelectorItem[] = useMemo(() => {
    return [
      {
        value: PTDay.Enum.weekday,
        label: t("weekday"),
      },
      {
        value: PTDay.Enum.saturday,
        label: t("saturday"),
      },
      {
        value: PTDay.Enum.sunday,
        label: t("sunday"),
      },
    ];
  }, [t]);

  const [selectedPTModes, setSelectedPTModes] = useState<
    SelectorItem[] | undefined
  >(ptModes);
  const [ptStartTime, setPTStartTime] = useState<number | undefined>(
    catchmentAreaConfigDefaults.pt.start_time,
  );
  const [ptEndTime, setPTEndTime] = useState<number | undefined>(
    catchmentAreaConfigDefaults.pt.end_time,
  );
  const [ptDay, setPTDay] = useState<SelectorItem | undefined>(ptDays[0]);
  const isPTValid = useMemo(() => {
    if (!ptStartTime || !ptEndTime || ptStartTime >= ptEndTime || !ptDay) {
      return false;
    }
    return true;
  }, [ptStartTime, ptEndTime, ptDay]);

  const resetPTConfiguration = useCallback(() => {
    setPTStartTime(catchmentAreaConfigDefaults.pt.start_time);
    setPTEndTime(catchmentAreaConfigDefaults.pt.end_time);
    setPTDay(ptDays[0]);
  }, [ptDays]);

  return {
    ptModes,
    ptDays,
    ptStartTime,
    setPTStartTime,
    ptEndTime,
    setPTEndTime,
    ptDay,
    setPTDay,
    isPTValid,
    selectedPTModes,
    setSelectedPTModes,
    resetPTConfiguration,
  };
};

export const useCatchmentAreaShapeTypes = () => {
  const { t } = useTranslation("common");
  const catchmentAreaShapeTypes: SelectorItem[] = useMemo(() => {
    return [
      {
        value: catchmentAreaShapeEnum.Enum.polygon,
        label: t("polygon"),
      },
      // {
      //   value: catchmentAreaShapeEnum.Enum.network,
      //   label: t("network"),
      // },
      // {
      //   value: catchmentAreaShapeEnum.Enum.rectangular_grid,
      //   label: t("rectangular_grid"),
      // },
    ];
  }, [t]);

  return {
    catchmentAreaShapeTypes,
  };
};

export const useStartingPointMethods = () => {
  const { t } = useTranslation("common");
  const startingPointMethods: SelectorItem[] = useMemo(() => {
    return [
      {
        value: "map",
        label: t("select_on_map"),
      },
      {
        value: "browser_layer",
        label: t("select_from_point_layer"),
      },
    ];
  }, [t]);

  return {
    startingPointMethods,
  };
};

export const useRoutingTypes = () => {
  const { t } = useTranslation("common");
  const [selectedRouting, setSelectedRouting] = useState<
    SelectorItem | undefined
  >(undefined);
  const activeMobilityRoutingTypes: SelectorItem[] = useMemo(() => {
    return [
      {
        value: CatchmentAreaRoutingTypeEnum.Enum.walking,
        label: t("routing_modes.walk"),
        icon: ICON_NAME.RUN,
      },
      {
        value: CatchmentAreaRoutingTypeEnum.Enum.bicycle,
        label: t("routing_modes.bicycle"),
        icon: ICON_NAME.BICYCLE,
      },
      {
        value: CatchmentAreaRoutingTypeEnum.Enum.pedelec,
        label: t("routing_modes.pedelec"),
        icon: ICON_NAME.PEDELEC,
      },
    ];
  }, [t]);

  const motorizedRoutingTypes: SelectorItem[] = useMemo(() => {
    return [
      {
        value: CatchmentAreaRoutingTypeEnum.Enum.car,
        label: t("routing_modes.car"),
        icon: ICON_NAME.CAR,
      },
      {
        value: CatchmentAreaRoutingTypeEnum.Enum.pt,
        label: t("routing_modes.pt"),
        icon: ICON_NAME.BUS,
      },
    ];
  }, [t]);

  const activeMobilityHeatmapRoutingTypes: SelectorItem[] = useMemo(() => {
    return [
      {
        value: HeatmapRoutingTypeEnum.Enum.walking,
        label: t("routing_modes.walk"),
        icon: ICON_NAME.RUN,
      },
      {
        value: HeatmapRoutingTypeEnum.Enum.bicycle,
        label: t("routing_modes.bicycle"),
        icon: ICON_NAME.BICYCLE,
      },
    ];
  }, [t]);

  const motorizedHeatmapRoutingTypes: SelectorItem[] = useMemo(() => {
    return [
      //TODO: Uncomment this when PT heatmap is implemented
      // {
      //   value: HeatmapRoutingTypeEnum.Enum.public_transport,
      //   label: t("routing_modes.pt"),
      //   icon: ICON_NAME.BUS,
      // },
    ];
  }, []);

  const routingTypes = useMemo(() => {
    return activeMobilityRoutingTypes.concat(motorizedRoutingTypes);
  }, [activeMobilityRoutingTypes, motorizedRoutingTypes]);

  return {
    activeMobilityRoutingTypes,
    motorizedRoutingTypes,
    routingTypes,
    selectedRouting,
    setSelectedRouting,
    activeMobilityHeatmapRoutingTypes,
    motorizedHeatmapRoutingTypes,
  };
};

export const useLayerByGeomType = (
  types:
    | ("feature" | "table" | "external_imagery" | "external_vector_tile")[]
    | undefined,
  featureGeomTypes: ("point" | "line" | "polygon" | undefined)[] | undefined,
  projectId: string,
) => {
  const { layers } = useProjectLayers(projectId as string);
  const filteredLayers: SelectorItem[] = useMemo(() => {
    if (!layers) return [];
    const layersByType = layers.filter((layer) => {
      if (!types) return true;
      return types.includes(layer.type);
    });

    return layersByType
      .filter((layer) => {
        if (!featureGeomTypes || layer.type !== "feature") return true;
        return featureGeomTypes.includes(layer.feature_layer_geometry_type);
      })
      .map((layer) => {
        return {
          value: layer.id,
          label: layer.name,
          icon: layer.type === "table" ? ICON_NAME.TABLE : ICON_NAME.LAYERS,
        };
      });
  }, [featureGeomTypes, layers, types]);

  return {
    filteredLayers,
  };
};

export const useLayerDatasetId = (
  layerId: number | undefined,
  projectId: string,
) => {
  const { layers } = useProjectLayers(projectId as string);
  const layerDatasetId = useMemo(() => {
    if (!layerId || !layers) {
      return undefined;
    }
    const layer = layers.find((layer) => layer.id === layerId);
    return layer?.layer_id;
  }, [layerId, layers]);

  return layerDatasetId;
};

export const useStatisticValues = () => {
  // Statistics values
  const { t } = useTranslation("common");
  const statisticMethods: SelectorItem[] = useMemo(() => {
    return [
      {
        value: statisticOperationEnum.Enum.count,
        label: t("count"),
      },
      {
        value: statisticOperationEnum.Enum.sum,
        label: t("sum"),
      },
      {
        value: statisticOperationEnum.Enum.mean,
        label: t("mean"),
      },
      {
        value: statisticOperationEnum.Enum.median,
        label: t("median"),
      },
      {
        value: statisticOperationEnum.Enum.min,
        label: t("min"),
      },
      {
        value: statisticOperationEnum.Enum.max,
        label: t("max"),
      },
    ];
  }, [t]);

  const [statisticMethodSelected, setStatisticMethodSelected] = useState<
    SelectorItem | undefined
  >(undefined);

  const [statisticField, setStatisticField] = useState<
    LayerFieldType | undefined
  >(undefined);

  useEffect(() => {
    if (statisticMethodSelected) {
      setStatisticField(undefined);
    }
  }, [statisticMethodSelected]);

  return {
    statisticMethods,
    statisticMethodSelected,
    setStatisticMethodSelected,
    statisticField,
    setStatisticField,
  };
};
