import React from "react";
import { Source, Layer as MapLayer } from "react-map-gl";
import type { ProjectLayer } from "@/lib/validations/project";
import { GEOAPI_BASE_URL } from "@/lib/constants";
import { useSortedLayers } from "@/hooks/map/LayerPanelHooks";
import { transformToMapboxLayerStyleSpec } from "@/lib/transformers/layer";

interface LayersProps {
  projectId: string;
}

const Layers = (props: LayersProps) => {
  const sortedLayers = useSortedLayers(props.projectId);

  return (
    <>
      {sortedLayers?.length
        ? sortedLayers.map((layer: ProjectLayer) =>
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
                            ? `?query=${JSON.stringify(layer.query)}`
                            : ""
                        }`,
                    ]}
                  >
                    <MapLayer {...transformToMapboxLayerStyleSpec(layer)} source-layer="default" />
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
