import React, { useMemo } from "react";
import type { LayerProps } from "react-map-gl";
import { Source, Layer as MapLayer } from "react-map-gl";
import type { ProjectLayer } from "@/lib/validations/project";
import { GEOAPI_BASE_URL } from "@/lib/constants";
import { useSortedLayers } from "@/hooks/map/LayerPanelHooks";
import { transformToMapboxLayerStyleSpec } from "@/lib/transformers/layer";
import type { FeatureLayerPointProperties } from "@/lib/validations/layer";

interface LayersProps {
  projectId: string;
}

const Layers = (props: LayersProps) => {
  const sortedLayers = useSortedLayers(props.projectId);
  const displayableLayers = useMemo(
    () => sortedLayers?.filter((layer) => layer.type !== "table"),
    [sortedLayers],
  );

  const getLayerKey = (layer: ProjectLayer) => {
    let id = layer.id.toString();
    if (layer.type === "feature") {
      const geometry_type = layer.feature_layer_geometry_type;
      if (geometry_type === "point") {
        const pointFeature = layer.properties as FeatureLayerPointProperties;
        const renderAs =
          pointFeature.custom_marker &&
          (pointFeature.marker?.name || pointFeature.marker_field)
            ? "marker"
            : "circle";
        id = `${id}-${renderAs}`;
      }
    }

    return id;
  };

  return (
    <>
      {displayableLayers?.length
        ? displayableLayers.map((layer: ProjectLayer, index: number) =>
            (() => {
              if (["feature", "external_vector_tile"].includes(layer.type)) {
                return (
                  <Source
                    key={layer.updated_at}
                    type="vector"
                    tiles={[
                      layer.url ??
                        `${GEOAPI_BASE_URL}/collections/user_data.${layer.layer_id.replace(
                          /-/g,
                          "",
                        )}/tiles/{z}/{x}/{y}${
                          layer.query
                            ? `?filter=${encodeURIComponent(
                                JSON.stringify(layer.query),
                              )}`
                            : ""
                        }`,
                    ]}
                  >
                    <MapLayer
                      key={getLayerKey(layer)}
                      id={layer.id.toString()}
                      {...(transformToMapboxLayerStyleSpec(
                        layer,
                      ) as LayerProps)}
                      beforeId={
                        index === 0
                          ? undefined
                          : displayableLayers[index - 1].id.toString()
                      }
                      source-layer="default"
                    />
                  </Source>
                );
              } else if (layer.type === "external_imagery") {
                return (
                  <Source
                    key={layer.updated_at}
                    type="raster"
                    tileSize={256}
                    tiles={[layer.url ?? ""]}
                  >
                    <MapLayer type="raster" />
                  </Source>
                );
              } else {
                return null;
              }
            })(),
          )
        : null}
    </>
  );
};

export default Layers;
