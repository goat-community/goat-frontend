import React, { useCallback, useEffect } from "react";
import { Source, Layer as MapLayer } from "react-map-gl";
import type { XYZ_Layer } from "@/types/map/layer";
import { useSelector } from "react-redux";
import type { IStore } from "@/types/store";
import { FILTERING } from "@/lib/api/apiConstants";
import { and_operator, or_operator } from "@/lib/utils/filtering_cql";
import type { LayerProps } from "react-map-gl";
import { v4 } from "uuid";
import type { Layer } from "@/lib/store/styling/slice";

interface LayersProps {
  layers: XYZ_Layer[];
  addLayer: (newLayer) => void;
  projectId: string;
  mapLayer: Layer;
}

const Layers = (props: LayersProps) => {
  const { filters, logicalOperator } = useSelector(
    (state: IStore) => state.mapFilters,
  );

  const { layers, addLayer, projectId, mapLayer } = props;

  const sampleLayerID = projectId;

  const getQuery = useCallback(() => {
    if (Object.keys(filters).length) {
      if (Object.keys(filters).length === 1) {
        return filters[Object.keys(filters)[0]];
      } else {
        if (logicalOperator === "match_all_expressions") {
          return and_operator(Object.keys(filters).map((key) => filters[key]));
        } else {
          return or_operator(Object.keys(filters).map((key) => filters[key]));
        }
      }
    }
  }, [filters, logicalOperator]);

  useEffect(() => {
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

    if (!Object.keys(filters).length) {
      addLayer([
        {
          id: "layer1",
          sourceUrl: `https://geoapi.goat.dev.plan4better.de/collections/${projectId}/tiles/{z}/{x}/{y}`,
          color: "#FF0000",
        },
      ]);
    }
  }, [addLayer, filters, getQuery, logicalOperator, sampleLayerID, projectId]);

  return (
    <>
      {layers.length
        ? layers.map((layer: XYZ_Layer) => (
            <Source key={v4()} type="vector" tiles={[layer.sourceUrl]}>
              <MapLayer {...mapLayer as LayerProps} />
            </Source>
          ))
        : null}
    </>
  );
};

export default Layers;
