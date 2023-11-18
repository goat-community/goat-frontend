import React, { useMemo } from "react";
import { Source, Layer as MapLayer } from "react-map-gl";
import type { Layer as ProjectLayer } from "@/lib/validations/layer";
import { GEOAPI_BASE_URL } from "@/lib/constants";
import { useProject, useProjectLayers } from "@/lib/api/projects";

interface LayersProps {
  projectId: string;
}

const Layers = (props: LayersProps) => {
  const { layers: projectLayers } = useProjectLayers(props.projectId);
  const { project } = useProject(props.projectId);
  const sortedLayers = useMemo(() => {
    if (!projectLayers || !project) return [];
    return projectLayers.sort(
      (a, b) =>
        project?.layer_order.indexOf(a.id) - project.layer_order.indexOf(b.id),
    );
  }, [projectLayers, project]);

  return (
    <>
      {sortedLayers?.length
        ? sortedLayers.map((layer: ProjectLayer) =>
            (() => {
              if (
                ["feature", "external_vector_tile"].includes(layer.type) &&
                layer.properties &&
                ["circle", "fill", "line", "symbol"].includes(
                  layer.properties.type,
                )
              ) {
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
                    <MapLayer {...layer.properties} source-layer="default" />
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
