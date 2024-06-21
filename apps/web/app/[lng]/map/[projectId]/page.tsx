"use client";

import { MAPBOX_TOKEN } from "@/lib/constants";
import { Box, debounce, useTheme } from "@mui/material";
import "mapbox-gl/dist/mapbox-gl.css";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  MapGeoJSONFeature,
  MapLayerMouseEvent,
  MapRef,
  ViewStateChangeEvent,
} from "react-map-gl";
import Map, { MapProvider } from "react-map-gl";
import Layers from "@/components/map/Layers";
import ProjectNavigation from "@/components/map/panels/ProjectNavigation";
import Header from "@/components/header/Header";
import {
  updateProjectInitialViewState,
  useProject,
  useProjectInitialViewState,
  useProjectLayers,
} from "@/lib/api/projects";
import { LoadingPage } from "@/components/common/LoadingPage";
import { useAppSelector } from "@/hooks/store/ContextHooks";
import { selectActiveBasemap } from "@/lib/store/map/selectors";
import MapPopover from "@/components/map/controls/Popover";
import { v4 } from "uuid";
import { addOrUpdateMarkerImages } from "@/lib/transformers/marker";
import type { FeatureLayerPointProperties } from "@/lib/validations/layer";
import ToolboxLayers from "@/components/map/ToolboxLayers";
import { useSortedLayers } from "@/hooks/map/LayerPanelHooks";
import { useTranslation } from "@/i18n/client";

const sidebarWidth = 52;
const toolbarHeight = 52;
const UPDATE_VIEW_STATE_DEBOUNCE_TIME = 3000;

export default function MapPage({ params: { projectId } }) {
  const theme = useTheme();
  const { t } = useTranslation("common");
  const activeBasemap = useAppSelector(selectActiveBasemap);
  const isGetInfoActive = useAppSelector(
    (state) => state.map.isMapGetInfoActive,
  );
  const mapCursor = useAppSelector((state) => state.map.mapCursor);
  const mapRef = useRef<MapRef | null>(null);
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

  const {
    isLoading: areProjectLayersLoading,
    isError: projectLayersError,
    layers: projectLayers,
  } = useProjectLayers(projectId);

  const sortedLayers = useSortedLayers(projectId, ["table"]);

  const isLoading = useMemo(
    () => isProjectLoading || isInitialViewLoading || areProjectLayersLoading,
    [isProjectLoading, isInitialViewLoading, areProjectLayersLoading],
  );

  const hasError = useMemo(
    () => projectError || projectInitialViewError || projectLayersError,
    [projectError, projectInitialViewError, projectLayersError],
  );

  const interactiveLayerIds = useMemo(
    () => projectLayers?.map((layer) => layer.id.toString()),
    [projectLayers],
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
      }, UPDATE_VIEW_STATE_DEBOUNCE_TIME),
    [initialView?.max_zoom, initialView?.min_zoom, projectId],
  );

  const [highlightedFeature, setHighlightedFeature] =
    useState<MapGeoJSONFeature | null>(null);

  const [popupInfo, setPopupInfo] = useState<{
    lngLat: [number, number];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    properties: { [name: string]: any } | null;
    jsonProperties: { [name: string]: unknown } | null;
    title: string;
  } | null>(null);

  const handleMapClick = (e: MapLayerMouseEvent) => {
    const features = e.features;
    const hiddenProperties = ["layer_id", "id"];
    if (features && features.length > 0 && isGetInfoActive) {
      const feature = features[0];
      setHighlightedFeature(feature);
      const layerName = projectLayers?.find(
        (layer) => layer.id === Number(feature.layer.id),
      )?.name;
      let lngLat = [e.lngLat.lng, e.lngLat.lat] as [number, number];
      if (feature.geometry.type === "Point" && feature.geometry.coordinates) {
        lngLat = [
          feature.geometry.coordinates[0],
          feature.geometry.coordinates[1],
        ];
      }
      const properties = feature.properties;
      const jsonProperties = {};
      const primitiveProperties = {};

      if (properties) {
        for (const key in properties) {
          if (!hiddenProperties.includes(key)) {
            const value = properties[key];
            try {
              const parsedValue = JSON.parse(value);
              if (typeof parsedValue === "object" && parsedValue !== null) {
                jsonProperties[key] = parsedValue;
              } else {
                throw new Error();
              }
            } catch (error) {
              primitiveProperties[key] = value;
            }
          }
        }
      }
      // Now you can use jsonProperties for visualization
      console.log(jsonProperties);
      console.log(primitiveProperties);

      setPopupInfo({
        lngLat,
        properties: primitiveProperties,
        jsonProperties: jsonProperties,
        title: layerName ?? "",
        // jsonProperties,
      });
    } else {
      setHighlightedFeature(null);
      setPopupInfo(null);
    }
  };

  const handleMapLoad = useCallback(() => {
    // get all icon layers and add icons to map using addOrUpdateMarkerImages method
    if (mapRef.current) {
      projectLayers?.forEach((layer) => {
        if (
          layer.type === "feature" &&
          layer.feature_layer_geometry_type === "point"
        ) {
          const pointFeatureProperties =
            layer.properties as FeatureLayerPointProperties;
          addOrUpdateMarkerImages(pointFeatureProperties, mapRef.current);
        }
      });
    }
  }, [projectLayers]);

  useEffect(() => {
    // icons are added to the style, so if the basestyle changes we have to reload icons to the style
    // it takes forever for certain styles to load so we have to wait a bit.
    // Couldn't find an event that catches the basemap change
    const debouncedHandleMapLoad = debounce(handleMapLoad, 200);
    debouncedHandleMapLoad();
  }, [activeBasemap.url, handleMapLoad]);

  const handlePopoverClose = () => {
    setPopupInfo(null);
    setHighlightedFeature(null);
  };

  const handleMapOverImmediate = (e: MapLayerMouseEvent) => {
    // Extract features immediately
    const features = e.features;
    if (mapRef.current) {
      // This is a hack to change the cursor to a pointer when hovering over a feature
      // It's not recommended to change the state of a component through internal methods
      // However, this is the only way to do it with the current version of react-map-gl
      // See https://github.com/visgl/react-map-gl/issues/579#issuecomment-1275163348
      const map = mapRef.current.getMap();
      if (mapCursor) {
        map.getCanvas().style.cursor = mapCursor;
      } else {
        map.getCanvas().style.cursor = features?.length ? "pointer" : "";
      }
    }
  };

  return (
    <>
      {isLoading && <LoadingPage />}
      {!isLoading && !hasError && (
        <MapProvider>
          <Header
            title={`${t("project")} ${project?.name ?? ""}`}
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
                ".mapboxgl-popup-content": {
                  padding: 0,
                  borderRadius: "6px",
                  background: theme.palette.background.paper,
                },
                ".mapboxgl-popup-anchor-top .mapboxgl-popup-tip, .mapboxgl-popup-anchor-top-left .mapboxgl-popup-tip, .mapboxgl-popup-anchor-top-right .mapboxgl-popup-tip":
                  {
                    borderBottomColor: theme.palette.background.paper,
                  },
                ".mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip, .mapboxgl-popup-anchor-bottom-right .mapboxgl-popup-tip, .mapboxgl-popup-anchor-bottom-left .mapboxgl-popup-tip":
                  {
                    borderTopColor: theme.palette.background.paper,
                  },
                ".mapboxgl-popup-anchor-left .mapboxgl-popup-tip": {
                  borderRightColor: theme.palette.background.paper,
                },
                ".mapboxgl-popup-anchor-right .mapboxgl-popup-tip": {
                  borderLeftColor: theme.palette.background.paper,
                },
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
                style={{ width: "100%", height: "100%" }}
                projection={{
                  name: "mercator",
                }}
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
                mapStyle={
                  activeBasemap?.url ?? "mapbox://styles/mapbox/streets-v11"
                }
                mapboxAccessToken={MAPBOX_TOKEN}
                interactiveLayerIds={interactiveLayerIds}
                dragRotate={false}
                touchZoomRotate={false}
                onMoveEnd={updateViewState}
                onClick={handleMapClick}
                onMouseMove={handleMapOverImmediate}
                onLoad={handleMapLoad}
              >
                <Layers
                  layers={sortedLayers}
                  highlightFeature={highlightedFeature}
                />
                <ToolboxLayers />

                {popupInfo && (
                  <MapPopover
                    key={highlightedFeature?.id ?? v4()}
                    {...popupInfo}
                    onClose={handlePopoverClose}
                  />
                )}
              </Map>
            </Box>
          </Box>
        </MapProvider>
      )}
    </>
  );
}
