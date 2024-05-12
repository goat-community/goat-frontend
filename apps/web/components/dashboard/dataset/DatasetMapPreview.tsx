import "mapbox-gl/dist/mapbox-gl.css";
import Layers from "@/components/map/Layers";
import { MAPBOX_TOKEN } from "@/lib/constants";
import type { Layer } from "@/lib/validations/layer";
import { Box, Paper } from "@mui/material";
import React, { useMemo, useRef, useState } from "react";
import type { MapRef } from "react-map-gl";
import { Map, MapProvider } from "react-map-gl";
import { wktToGeoJSON } from "@/lib/utils/map/wkt";
import bbox from "@turf/bbox";
import { Legend } from "@/components/map/controls/Legend";
import type { ProjectLayer } from "@/lib/validations/project";
import { Recenter } from "@/components/map/controls/Recenter";

interface DatasetMapPreviewProps {
  dataset: Layer;
}

const DatasetMapPreview: React.FC<DatasetMapPreviewProps> = ({ dataset }) => {
  const mapRef = useRef<MapRef | null>(null);
  const geojson = wktToGeoJSON(dataset.extent);
  const boundingBox = bbox(geojson);
  const [initialViewState, setInitialViewState] = useState({});

  const [currentViewState, setCurrentViewState] = useState({});

  const hasMoved = useMemo(() => {
    return (
      Object.keys(currentViewState).length &&
      Object.keys(initialViewState).length &&
      JSON.stringify(currentViewState) !== JSON.stringify(initialViewState)
    );
  }, [currentViewState, initialViewState]);

  return (
    <>
      <MapProvider>
        <Box
          sx={{
            position: "relative",
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
            id="map"
            ref={mapRef}
            initialViewState={{
              bounds: boundingBox as [number, number, number, number],
              fitBoundsOptions: { padding: 10 },
            }}
            onMove={(e) => {
              setCurrentViewState({
                longitude: e.viewState.longitude.toFixed(4),
                latitude: e.viewState.latitude.toFixed(4),
              });
            }}
            onLoad={() => {
              const center = mapRef.current?.getMap().getCenter();
              if (center) {
                setInitialViewState({
                  longitude: center.lng.toFixed(4),
                  latitude: center.lat.toFixed(4),
                });
              }
            }}
            style={{ width: "100%", height: "100%" }}
            mapStyle="mapbox://styles/mapbox/light-v11"
            mapboxAccessToken={MAPBOX_TOKEN}
            dragRotate={false}
            touchZoomRotate={false}
          >
            <Layers layers={[dataset]} />
          </Map>

          {!!hasMoved && (
            <Box
              sx={{
                position: "absolute",
                left: 15,
                top: 5,
              }}
            >
              <Recenter initialExtent={dataset.extent} />
            </Box>
          )}

          <Box>
            <Paper
              sx={{
                position: "absolute",
                top: 10,
                right: 10,
                px: 4,
                maxHeight: "300px",
                minWidth: "220px",
                overflow: "auto",
              }}
            >
              <Legend
                layers={[dataset] as unknown as ProjectLayer[]}
                hideZoomLevel
                hideLayerName
              />
            </Paper>
          </Box>
        </Box>
      </MapProvider>
    </>
  );
};

export default DatasetMapPreview;
