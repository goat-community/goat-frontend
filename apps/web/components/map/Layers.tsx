import React, { useMemo } from "react";
import type { LayerProps, MapGeoJSONFeature } from "react-map-gl";
import { Layer as MapLayer, Source } from "react-map-gl";

import { GEOAPI_BASE_URL } from "@/lib/constants";
import { excludes as excludeOp } from "@/lib/transformers/filter";
import { getHightlightStyleSpec, transformToMapboxLayerStyleSpec } from "@/lib/transformers/layer";
import type { FeatureLayerPointProperties, Layer } from "@/lib/validations/layer";
import type { ProjectLayer } from "@/lib/validations/project";
import { type ScenarioFeatures, scenarioEditTypeEnum } from "@/lib/validations/scenario";

interface LayersProps {
  layers?: ProjectLayer[] | Layer[];
  highlightFeature?: MapGeoJSONFeature | null;
  scenarioFeatures?: ScenarioFeatures | null;
}

const Layers = (props: LayersProps) => {
  const scenarioFeaturesToExclude = useMemo(() => {
    const featuresToExclude: { [key: string]: number[] } = {};
    props.scenarioFeatures?.features.forEach((feature) => {
      // Exclude deleted and modified features
      if (
        feature.properties?.edit_type === scenarioEditTypeEnum.Enum.d ||
        feature.properties?.edit_type === scenarioEditTypeEnum.Enum.m
      ) {
        if (!featuresToExclude[feature.properties.layer_id])
          featuresToExclude[feature.properties.layer_id] = [];

        if (feature.properties?.feature_id)
          featuresToExclude[feature.properties.layer_id].push(feature.properties?.feature_id);
      }
    });

    return featuresToExclude;
  }, [props.scenarioFeatures]);

  const getLayerQueryFilter = (layer: ProjectLayer | Layer) => {
    const cqlFilter = layer["query"]?.cql;
    if (!layer["layer_id"] || !Object.keys(scenarioFeaturesToExclude).length) return cqlFilter;

    const extendedFilter = JSON.parse(JSON.stringify(cqlFilter || {}));
    if (scenarioFeaturesToExclude[layer["layer_id"].toString()]) {
      const scenarioFeaturesExcludeFilter = excludeOp(
        "id",
        scenarioFeaturesToExclude[layer["layer_id"].toString()]
      );
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

  const getLayerKey = (layer: ProjectLayer | Layer) => {
    let id = layer.id.toString();
    if (layer.type === "feature") {
      const geometry_type = layer.feature_layer_geometry_type;
      if (geometry_type === "point") {
        const pointFeature = layer.properties as FeatureLayerPointProperties;
        const renderAs =
          pointFeature.custom_marker && (pointFeature.marker?.name || pointFeature.marker_field)
            ? "marker"
            : "circle";
        id = `${id}-${renderAs}`;
      }
    }
    return id;
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

  return (
    <>
      {props.layers?.length
        ? props.layers.map((layer: ProjectLayer | Layer, index: number) =>
            (() => {
              if (["feature", "external_vector_tile"].includes(layer.type)) {
                return (
                  <Source key={layer.updated_at} type="vector" tiles={[getTileUrl(layer)]}>
                    <MapLayer
                      key={getLayerKey(layer)}
                      id={layer.id.toString()}
                      {...(transformToMapboxLayerStyleSpec(layer) as LayerProps)}
                      beforeId={
                        index === 0 || !props.layers ? undefined : props.layers[index - 1].id.toString()
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
              } else if (layer.type === "external_imagery") {
                return (
                  <Source key={layer.updated_at} type="raster" tileSize={256} tiles={[layer.url ?? ""]}>
                    <MapLayer type="raster" />
                  </Source>
                );
              } else {
                return null;
              }
            })()
          )
        : null}
    </>
  );
};

export default Layers;
