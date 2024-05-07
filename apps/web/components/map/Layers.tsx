import React from "react";
import type { LayerProps, MapGeoJSONFeature } from "react-map-gl";
import { Source, Layer as MapLayer } from "react-map-gl";
import type { ProjectLayer } from "@/lib/validations/project";
import { GEOAPI_BASE_URL } from "@/lib/constants";
import {
  getHightlightStyleSpec,
  transformToMapboxLayerStyleSpec,
} from "@/lib/transformers/layer";
import type {
  FeatureLayerPointProperties,
  Layer,
} from "@/lib/validations/layer";

interface LayersProps {
  layers?: ProjectLayer[] | Layer[];
  highlightFeature?: MapGeoJSONFeature | null;
}

const Layers = (props: LayersProps) => {
  const getLayerKey = (layer: ProjectLayer | Layer) => {
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

  const getTileUrl = (layer: ProjectLayer | Layer) => {
    if (layer.type === "external_vector_tile") {
      return layer.url ?? "";
    }
    let query = "";
    if (layer["query"] && layer["query"]["cql"]) {
      query = `?filter=${encodeURIComponent(JSON.stringify(layer["query"]["cql"]))}`;
    }
    const collectionId = layer["layer_id"] || layer["id"];
    return `${GEOAPI_BASE_URL}/collections/user_data.${collectionId.replace(
      /-/g,
      "",
    )}/tiles/{z}/{x}/{y}${query}`;
  };

  return (
    <>
      {props.layers?.length
        ? props.layers.map((layer: ProjectLayer | Layer, index: number) =>
            (() => {
              if (["feature", "external_vector_tile"].includes(layer.type)) {
                return (
                  <Source
                    key={layer.updated_at}
                    type="vector"
                    tiles={[getTileUrl(layer)]}
                  >
                    <MapLayer
                      key={getLayerKey(layer)}
                      id={layer.id.toString()}
                      {...(transformToMapboxLayerStyleSpec(
                        layer,
                      ) as LayerProps)}
                      beforeId={
                        index === 0 || !props.layers
                          ? undefined
                          : props.layers[index - 1].id.toString()
                      }
                      source-layer="default"
                    />

                    {/* HighlightLayer */}
                    {props.highlightFeature &&
                      props.highlightFeature.properties?.id &&
                      props.highlightFeature.layer.id ===
                        layer.id.toString() && (
                        <MapLayer
                          id={`highlight-${layer.id}`}
                          source-layer="default"
                          {...(getHightlightStyleSpec(
                            props.highlightFeature,
                          ) as LayerProps)}
                        />
                      )}
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
