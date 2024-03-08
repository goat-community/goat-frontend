import Layers from "@/components/map/Layers";
import { MAPBOX_TOKEN } from "@/lib/constants";
import { zoomToLayer } from "@/lib/utils/map/navigate";
import type { Layer } from "@/lib/validations/layer";
import { Box } from "@mui/material";
import React, { useCallback, useRef } from "react";
import type { MapRef } from "react-map-gl";
import { Map } from "react-map-gl";

interface DatasetMapPreviewProps {
  dataset: Layer;
}

const DatasetMapPreview: React.FC<DatasetMapPreviewProps> = ({ dataset }) => {
  const mapRef = useRef<MapRef | null>(null);
  const handleOnLoad = useCallback(() => {
    if (mapRef.current) {
      zoomToLayer(mapRef.current, dataset.extent);
    }
  }, [dataset]);
  console.log("DatasetMapPreview", dataset);
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: `680px`,
      }}
    >
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: 0,
          latitude: 0,
          zoom: 2,
        }}
        attributionControl={false}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        onLoad={handleOnLoad}
      >
        <Layers layers={[dataset]} />
      </Map>
    </Box>
  );
};

export default DatasetMapPreview;
