import { useTranslation } from "@/i18n/client";
import { useLayerKeys } from "@/lib/api/layers";
import { useProjectLayers } from "@/lib/api/projects";
import type { LayerFieldType } from "@/lib/validations/layer";
import {
  PTDay,
  PTRoutingModes,
  catchmentAreaConfigDefaults,
  statisticOperationEnum,
} from "@/lib/validations/tools";
import type { SelectorItem } from "@/types/map/common";
import { ICON_NAME } from "@p4b/ui/components/Icon";
import { useCallback, useEffect, useMemo, useState } from "react";
export const useGetLayerKeys = (layerId: string) => {
  const { isLoading, error, data } = useLayerKeys(layerId);
  return {
    keys:
      isLoading || error || !data
        ? []
        : Object.keys(data.properties)
            .filter((key) => "name" in data.properties[key])
            .map((key) => ({
              name: data.properties[key].name,
              type: data.properties[key].type,
            })),
  };
};

export const usePTTimeSelectorValues = () => {
  const { t } = useTranslation("maps");
  const ptModes: SelectorItem[] = useMemo(() => {
    return [
      {
        value: PTRoutingModes.Enum.bus,
        label: t("panels.isochrone.routing.modes.bus"),
        icon: ICON_NAME.BUS,
      },
      {
        value: PTRoutingModes.Enum.tram,
        label: t("panels.isochrone.routing.modes.tram"),
        icon: ICON_NAME.TRAM,
      },
      {
        value: PTRoutingModes.Enum.rail,
        label: t("panels.isochrone.routing.modes.rail"),
        icon: ICON_NAME.RAIL,
      },
      {
        value: PTRoutingModes.Enum.subway,
        label: t("panels.isochrone.routing.modes.subway"),
        icon: ICON_NAME.SUBWAY,
      },
      {
        value: PTRoutingModes.Enum.ferry,
        label: t("panels.isochrone.routing.modes.ferry"),
        icon: ICON_NAME.FERRY,
      },
      {
        value: PTRoutingModes.Enum.cable_car,
        label: t("panels.isochrone.routing.modes.cable_car"),
        icon: ICON_NAME.CABLE_CAR,
      },
      {
        value: PTRoutingModes.Enum.gondola,
        label: t("panels.isochrone.routing.modes.gondola"),
        icon: ICON_NAME.GONDOLA,
      },
      {
        value: PTRoutingModes.Enum.funicular,
        label: t("panels.isochrone.routing.modes.funicular"),
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
  const { t } = useTranslation("maps");
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
