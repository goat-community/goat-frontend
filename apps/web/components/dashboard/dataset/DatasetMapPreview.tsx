import "mapbox-gl/dist/mapbox-gl.css";
import Layers from "@/components/map/Layers";
import { MAPBOX_TOKEN } from "@/lib/constants";
import { zoomToLayer } from "@/lib/utils/map/navigate";
import type { Layer } from "@/lib/validations/layer";
import { Box } from "@mui/material";
import React, { useRef } from "react";
import type { MapRef } from "react-map-gl";
import { Map } from "react-map-gl";
import { wktToGeoJSON } from "@/lib/utils/map/wkt";
import bbox from "@turf/bbox";

interface DatasetMapPreviewProps {
  dataset: Layer;
}

const DatasetMapPreview: React.FC<DatasetMapPreviewProps> = ({ dataset }) => {
  const mapRef = useRef<MapRef | null>(null);
  const geojson = wktToGeoJSON(dataset.extent);
  const boundingBox = bbox(geojson);

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: `calc(100vh - 380px)`,
        overflow: "hidden",
        ".mapbox-improve-map": {
          display: "none",
        },
        ".mapboxgl-ctrl-attrib a": {
          color: "rgba(0,0,0,.75)",
        },
      }}
    >
      <Map
        ref={mapRef}
        initialViewState={{
          bounds: boundingBox as [number, number, number, number],
          fitBoundsOptions: { padding: 10 },
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        <Layers layers={[dataset]} />
      </Map>
    </Box>
  );
};

export default DatasetMapPreview;
