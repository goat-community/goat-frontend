import React, { useEffect, useCallback } from "react";
import { Source, Layer as MapLayer } from "react-map-gl";
import type { XYZ_Layer } from "@/types/map/layer";
import { useSelector } from "react-redux";
import type { IStore } from "@/types/store";
import { FILTERING } from "@/lib/api/apiConstants";
import { and_operator, or_operator } from "@/lib/utils/filtering/filtering_cql";
import type { LayerProps } from "react-map-gl";
import { v4 } from "uuid";

interface LayersProps {
  layers: XYZ_Layer[];
  addLayer: (newLayer) => void;
  projectId: string;
  filters: any;
}

const Layers = (props: LayersProps) => {
  const sampleLayerID = "user_data.e66f60f87ec248faaebb8a8c64c29990";
  const { layers, addLayer, projectId, filters } = props;

  const { layerToBeFiltered } = useSelector(
    (state: IStore) => state.mapFilters,
  );

  const availableFilters = filters.filter(
    (filterQuery) => filterQuery !== "{}",
  );

  const { logicalOperator } = useSelector((state: IStore) => state.mapFilters);

  const projectLayers = useSelector((state: IStore) => state.layers.layers);
  const getQuery = useCallback(() => {
    if (availableFilters.length) {
      if (availableFilters.length === 1) {
        return availableFilters[0];
      } else {
        if (logicalOperator === "match_all_expressions") {
          return and_operator(availableFilters);
        } else {
          return or_operator(availableFilters);
        }
      }
    }
  }, [availableFilters, logicalOperator]);

  const filterJson = getQuery();

  function modifyLayer() {
    const filterJson = getQuery();
    if (filterJson) {
      const filteredLayerSource = `${FILTERING(
        sampleLayerID,
      )}?filter=${encodeURIComponent(filterJson)}`;
      addLayer([
        {
          id: "layer1",
          sourceUrl: filteredLayerSource,
          color: "#FF0000",
        },
      ]);
    } else if (filterJson === "") {
      addLayer([
        {
          id: "layer1",
          sourceUrl: FILTERING(sampleLayerID),
          color: "#FF0000",
        },
      ]);
    }

    if (!availableFilters.length) {
      addLayer([
        {
          id: "layer1",
          sourceUrl: FILTERING(sampleLayerID),
          color: "#FF0000",
        },
      ]);
    }
  }

  useEffect(() => {
    modifyLayer();
  }, [filterJson]);

  const clusterLayer: LayerProps = {
    id: "clusters",
    type: "circle",
    source: "composite",
    "source-layer": "default",
    paint: {
      "circle-color": "#51bbd6",
      "circle-radius": 5,
    },
  };

  return (
    <>
      {layers.length
        ? layers.map((layer: XYZ_Layer) => (
            <Source key={v4()} type="vector" tiles={[layer.sourceUrl]}>
              <MapLayer {...clusterLayer} />
            </Source>
          ))
        : null}
    </>
  );
};

export default Layers;
