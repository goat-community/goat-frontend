"use client";

import type { XYZ_Layer } from "@/types/map/layer";
import { MAPBOX_TOKEN } from "@/lib/constants";
import { Box, useTheme } from "@mui/material";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useCallback, useState } from "react";
import Map, { MapProvider, Layer, Source } from "react-map-gl";
import Layers from "@/components/map/Layers";
import MobileDrawer from "@/components/map/panels/MobileDrawer";

import { useSelector } from "react-redux";
import type { IStore } from "@/types/store";
import { selectMapLayer } from "@/lib/store/styling/selectors";
import ProjectNavigation from "@/components/map/panels/ProjectNavigation";
import Header from "@/components/header/Header";
import { useProject } from "@/lib/api/projects";
import { useFilterQueries } from "@/lib/api/filter";

const sidebarWidth = 48;
const toolbarHeight = 52;

export default function MapPage({ params: { projectId } }) {
  const { basemaps, activeBasemapIndex, initialViewState } = useSelector(
    (state: IStore) => state.styling,
  );
  const { project } = useProject(projectId);
  const mapLayer = useSelector(selectMapLayer);
  const { layerToBeFiltered } = useSelector(
    (state: IStore) => state.mapFilters,
  );
  const { data: filters } = useFilterQueries(projectId, layerToBeFiltered);

  const [layers, setLayers] = useState<XYZ_Layer[] | []>([
    {
      id: "layer1",
      sourceUrl:
        "https://geoapi.goat.dev.plan4better.de/collections/user_data.e66f60f87ec248faaebb8a8c64c29990/tiles/{z}/{x}/{y}",
      color: "#FF0000",
    },
  ]);

  const theme = useTheme();

  const addLayer = useCallback((newLayer: XYZ_Layer[]) => {
    setLayers(newLayer);
  }, [filters]);

  return (
    <MapProvider>
      <Header
        title={`Project ${project?.name ?? ""}`}
        showHambugerMenu={false}
        tags={project?.tags}
        lastSaved={project?.updated_at}
      />
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          width: `calc(100% - ${2 * sidebarWidth}px)`,
          marginLeft: `${sidebarWidth}px`,
          [theme.breakpoints.down("sm")]: {
            marginLeft: "0",
            width: `100%`,
          },
        }}
      >
        <Box>
          <ProjectNavigation projectId={projectId} />
        </Box>
        <Box
          sx={{
            width: "100%",
            ".mapboxgl-ctrl .mapboxgl-ctrl-logo": {
              display: "none",
            },
            height: `calc(100% - ${toolbarHeight}px)`,
          }}
        >
          <Map
            id="map"
            style={{ width: "100%", height: "100%" }}
            initialViewState={initialViewState}
            mapStyle={basemaps[activeBasemapIndex[0]].url}
            attributionControl={false}
            mapboxAccessToken={MAPBOX_TOKEN}
          >
            {mapLayer ? (
              <Source
                id={mapLayer.id}
                type="vector"
                url={mapLayer.sources.composite.url}
              >
                <Layer {...mapLayer} source-layer={mapLayer["source-layer"]} />
              </Source>
            ) : null}
            {/* todo check */}
            <Layers layers={layers} filters={filters} addLayer={addLayer} projectId={projectId} />
          </Map>
        </Box>
      </Box>
      <Box>
        <MobileDrawer />
      </Box>
    </MapProvider>
  );
}
