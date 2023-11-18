"use client";

import { MAPBOX_TOKEN } from "@/lib/constants";
import { Box, debounce, useTheme } from "@mui/material";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useMemo } from "react";
import type { ViewStateChangeEvent } from "react-map-gl";
import Map, { MapProvider } from "react-map-gl";
import Layers from "@/components/map/Layers";
import MobileDrawer from "@/components/map/panels/MobileDrawer";

import { useSelector } from "react-redux";
import type { IStore } from "@/types/store";
import ProjectNavigation from "@/components/map/panels/ProjectNavigation";
import Header from "@/components/header/Header";
import {
  updateProjectInitialViewState,
  useProject,
  useProjectInitialViewState,
  useProjectLayers,
} from "@/lib/api/projects";
import { LoadingPage } from "@/components/common/LoadingPage";

const sidebarWidth = 52;
const toolbarHeight = 52;

export default function MapPage({ params: { projectId } }) {
  const theme = useTheme();
  const { basemaps, activeBasemapIndex } = useSelector(
    (state: IStore) => state.styling,
  );
  const {
    project,
    isLoading: isProjectLoading,
    isError: projectError,
  } = useProject(projectId);
  const {
    initialView,
    isLoading: isInitialViewLoading,
    isError: projectInitialViewError,
  } = useProjectInitialViewState(projectId);

  const { isLoading: areProjectLayersLoading, isError: projectLayersError } =
    useProjectLayers(projectId);

  const isLoading = useMemo(
    () => isProjectLoading || isInitialViewLoading || areProjectLayersLoading,
    [isProjectLoading, isInitialViewLoading, areProjectLayersLoading],
  );

  const hasError = useMemo(
    () => projectError || projectInitialViewError || projectLayersError,
    [projectError, projectInitialViewError, projectLayersError],
  );
  const updateViewState = useMemo(
    () =>
      debounce((e: ViewStateChangeEvent) => {
        updateProjectInitialViewState(projectId, {
          zoom: e.viewState.zoom,
          latitude: e.viewState.latitude,
          longitude: e.viewState.longitude,
          pitch: e.viewState.pitch,
          bearing: e.viewState.bearing,
          min_zoom: initialView?.min_zoom ?? 0,
          max_zoom: initialView?.max_zoom ?? 24,
        });
      }, 2000),
    [initialView?.max_zoom, initialView?.min_zoom, projectId],
  );

  return (
    <>
      {isLoading && <LoadingPage />}
      {!isLoading && !hasError && (
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
                onMoveEnd={updateViewState}
                initialViewState={{
                  zoom: initialView?.zoom ?? 3,
                  latitude: initialView?.latitude ?? 48.13,
                  longitude: initialView?.longitude ?? 11.57,
                  pitch: initialView?.pitch ?? 0,
                  bearing: initialView?.bearing ?? 0,
                  fitBoundsOptions: {
                    minZoom: initialView?.min_zoom ?? 0,
                    maxZoom: initialView?.max_zoom ?? 24,
                  },
                }}
                mapStyle={basemaps[activeBasemapIndex[0]].url}
                attributionControl={false}
                mapboxAccessToken={MAPBOX_TOKEN}
              >
                <Layers projectId={projectId} />
              </Map>
            </Box>
          </Box>
          <Box>
            <MobileDrawer />
          </Box>
        </MapProvider>
      )}
    </>
  );
}
