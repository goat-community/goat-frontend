import React, { useMemo } from "react";
import type { LayerProps, MapGeoJSONFeature } from "react-map-gl";
import { Layer as MapLayer, Source } from "react-map-gl";

import { GEOAPI_BASE_URL, SYSTEM_LAYERS_IDS } from "@/lib/constants";
import { excludes as excludeOp } from "@/lib/transformers/filter";
import { getHightlightStyleSpec, transformToMapboxLayerStyleSpec } from "@/lib/transformers/layer";
import { getLayerKey } from "@/lib/utils/map/layer";
import type { Layer } from "@/lib/validations/layer";
import type { ProjectLayer } from "@/lib/validations/project";
import { type ScenarioFeatures, scenarioEditTypeEnum } from "@/lib/validations/scenario";

interface LayersProps {
  layers?: ProjectLayer[] | Layer[];
  selectedScenarioLayer?: ProjectLayer | null;
  highlightFeature?: MapGeoJSONFeature | null;
  scenarioFeatures?: ScenarioFeatures | null;
}

const Layers = (props: LayersProps) => {
  const scenarioFeaturesToExclude = useMemo(() => {
    const featuresToExclude: { [key: string]: string[] } = {};
    props.scenarioFeatures?.features.forEach((feature) => {
      // Exclude deleted and modified features
      if (
        feature.properties?.edit_type === scenarioEditTypeEnum.Enum.d ||
        feature.properties?.edit_type === scenarioEditTypeEnum.Enum.m
      ) {
        const projectLayerId = feature.properties.layer_project_id;
        if (!projectLayerId || !feature.properties?.feature_id) return;

        if (!featuresToExclude[projectLayerId]) featuresToExclude[projectLayerId] = [];

        if (feature.properties?.feature_id)
          featuresToExclude[projectLayerId].push(feature.properties?.feature_id);
      }
    });

    return featuresToExclude;
  }, [props.scenarioFeatures]);

  const getLayerQueryFilter = (layer: ProjectLayer | Layer) => {
    const cqlFilter = layer["query"]?.cql;
    if (!layer["layer_id"] || !Object.keys(scenarioFeaturesToExclude).length) return cqlFilter;

    const extendedFilter = JSON.parse(JSON.stringify(cqlFilter || {}));
    if (scenarioFeaturesToExclude[layer.id]?.length) {
      const scenarioFeaturesExcludeFilter = excludeOp("id", scenarioFeaturesToExclude[layer.id]);
      const parsedScenarioFeaturesExcludeFilter = JSON.parse(scenarioFeaturesExcludeFilter);
      // Append the filter to the existing filters
      if (extendedFilter["op"] === "and" && extendedFilter["args"]) {
        extendedFilter["args"].push(parsedScenarioFeaturesExcludeFilter);
      } else {
        // Create a new filter
        extendedFilter["op"] = "and";
        extendedFilter["args"] = [parsedScenarioFeaturesExcludeFilter];
      }
    }

    return extendedFilter;
  };

  const getTileUrl = (layer: ProjectLayer | Layer) => {
    if (layer.type === "external_vector_tile") {
      return layer.url ?? "";
    }
    let query = "";

    const extendedQuery = getLayerQueryFilter(layer);
    if (extendedQuery && Object.keys(extendedQuery).length > 0) {
      query = `?filter=${encodeURIComponent(JSON.stringify(extendedQuery))}`;
    }
    const collectionId = layer["layer_id"] || layer["id"];
    return `${GEOAPI_BASE_URL}/collections/user_data.${collectionId.replace(
      /-/g,
      ""
    )}/tiles/{z}/{x}/{y}${query}`;
  };

  const useDataLayers = useMemo(() => {
    return props.layers?.filter((layer) => {
      const layerId = layer["layer_id"] ?? layer.id;
      return (
        ["feature", "external_vector_tile"].includes(layer.type) && SYSTEM_LAYERS_IDS.indexOf(layerId) === -1
      );
    });
  }, [props.layers]);

  const systemLayers = useMemo(() => {
    return props.layers?.filter((layer) => {
      const layerId = layer["layer_id"] ?? layer.id;
      return ["feature"].includes(layer.type) && SYSTEM_LAYERS_IDS.indexOf(layerId) !== -1;
    });
  }, [props.layers]);

  return (
    <>
      {useDataLayers?.length
        ? useDataLayers.map((layer: ProjectLayer | Layer, index: number) =>
            (() => {
              if (["feature", "external_vector_tile"].includes(layer.type)) {
                return (
                  <Source key={layer.updated_at} type="vector" tiles={[getTileUrl(layer)]}>
                    <MapLayer
                      key={getLayerKey(layer)}
                      id={layer.id.toString()}
                      {...(transformToMapboxLayerStyleSpec(layer) as LayerProps)}
                      beforeId={
                        index === 0 || !useDataLayers ? undefined : useDataLayers[index - 1].id.toString()
                      }
                      source-layer="default"
                    />

                    {/* HighlightLayer */}
                    {props.highlightFeature &&
                      props.highlightFeature.properties?.id &&
                      props.highlightFeature.layer.id === layer.id.toString() && (
                        <MapLayer
                          id={`highlight-${layer.id}`}
                          source-layer="default"
                          {...(getHightlightStyleSpec(props.highlightFeature) as LayerProps)}
                        />
                      )}
                  </Source>
                );
              } else {
                return null;
              }
            })()
          )
        : null}
      {systemLayers?.length
        ? systemLayers.map((layer: ProjectLayer | Layer) =>
            props.selectedScenarioLayer?.id === layer.id ? (
              <Source
                key={layer.updated_at}
                type="vector"
                tiles={[getTileUrl(layer)]}
                minzoom={14}
                maxzoom={22}>
                <MapLayer
                  key={getLayerKey(layer)}
                  id={layer.id.toString()}
                  {...(transformToMapboxLayerStyleSpec(layer) as LayerProps)}
                  source-layer="default"
                  minzoom={14}
                  maxzoom={22}
                />
              </Source>
            ) : null
          )
        : null}
    </>
  );
};

export default Layers;
