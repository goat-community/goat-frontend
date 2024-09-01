"use client";

import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { Box, debounce, useTheme } from "@mui/material";
import "maplibre-gl/dist/maplibre-gl.css";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import type { MapLayerMouseEvent, MapRef, ViewStateChangeEvent } from "react-map-gl/maplibre";
import Map, { MapProvider } from "react-map-gl/maplibre";
import { v4 } from "uuid";

import { useTranslation } from "@/i18n/client";

import {
  updateProjectInitialViewState,
  useProject,
  useProjectInitialViewState,
  useProjectScenarioFeatures,
} from "@/lib/api/projects";
import { PATTERN_IMAGES } from "@/lib/constants/pattern-images";
import { DrawProvider } from "@/lib/providers/DrawProvider";
import { selectActiveBasemap } from "@/lib/store/map/selectors";
import { setHighlightedFeature, setPopupInfo } from "@/lib/store/map/slice";
import { addOrUpdateMarkerImages, addPatternImages } from "@/lib/transformers/map-image";
import type { FeatureLayerPointProperties } from "@/lib/validations/layer";

import { useJobStatus } from "@/hooks/jobs/JobStatus";
import { useFilteredProjectLayers } from "@/hooks/map/LayerPanelHooks";
import { useAppDispatch, useAppSelector } from "@/hooks/store/ContextHooks";

import { LoadingPage } from "@/components/common/LoadingPage";
import Header from "@/components/header/Header";
import Layers from "@/components/map/Layers";
import ScenarioLayer from "@/components/map/ScenarioLayer";
import ToolboxLayers from "@/components/map/ToolboxLayers";
import MapPopoverEditor from "@/components/map/controls/PopoverEditor";
import MapPopoverInfo from "@/components/map/controls/PopoverInfo";
import { DrawControl } from "@/components/map/controls/draw/Draw";
import ProjectNavigation from "@/components/map/panels/ProjectNavigation";

const sidebarWidth = 52;
const toolbarHeight = 52;
const UPDATE_VIEW_STATE_DEBOUNCE_TIME = 3000;

export default function MapPage({ params: { projectId } }) {
  const theme = useTheme();
  const { t } = useTranslation("common");
  const activeBasemap = useAppSelector(selectActiveBasemap);
  const isGetInfoActive = useAppSelector((state) => state.map.isMapGetInfoActive);
  const popupInfo = useAppSelector((state) => state.map.popupInfo);
  const popupEditor = useAppSelector((state) => state.map.popupEditor);
  const mapCursor = useAppSelector((state) => state.map.mapCursor);
  const highlightedFeature = useAppSelector((state) => state.map.highlightedFeature);
  const dispatch = useAppDispatch();
  const mapRef = useRef<MapRef | null>(null);
  const {
    project,
    isLoading: isProjectLoading,
    isError: projectError,
    mutate: mutateProject,
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
    mutate: mutateProjectLayers,
  } = useFilteredProjectLayers(projectId, ["table"], []);

  //todo: fix this. Should save selectedScenarioEditLayer as ProjectLayer type instead
  const _selectedScenarioEditLayer = useAppSelector((state) => state.map.selectedScenarioLayer);
  const selectedScenarioEditLayer = useMemo(() => {
    return projectLayers?.find((layer) => layer.id === _selectedScenarioEditLayer?.value);
  }, [_selectedScenarioEditLayer, projectLayers]);

  const { scenarioFeatures } = useProjectScenarioFeatures(projectId, project?.active_scenario_id);

  const isLoading = useMemo(
    () => isProjectLoading || isInitialViewLoading || areProjectLayersLoading,
    [isProjectLoading, isInitialViewLoading, areProjectLayersLoading]
  );

  const hasError = useMemo(
    () => projectError || projectInitialViewError || projectLayersError,
    [projectError, projectInitialViewError, projectLayersError]
  );

  const interactiveLayerIds = useMemo(
    () => projectLayers?.map((layer) => layer.id.toString()),
    [projectLayers]
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
    [initialView?.max_zoom, initialView?.min_zoom, projectId]
  );

  const handleMapClick = (e: MapLayerMouseEvent) => {
    const features = e.features;
    const hiddenProperties = ["layer_id", "id", "h3_3", "h3_6"];
    if (features && features.length > 0 && isGetInfoActive) {
      const feature = features[0];
      dispatch(setHighlightedFeature(feature));
      const layerName = projectLayers?.find((layer) => layer.id === Number(feature.layer.id))?.name;
      let lngLat = [e.lngLat.lng, e.lngLat.lat] as [number, number];
      if (feature.geometry.type === "Point" && feature.geometry.coordinates) {
        lngLat = [feature.geometry.coordinates[0], feature.geometry.coordinates[1]];
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

      dispatch(
        setPopupInfo({
          lngLat,
          properties: primitiveProperties,
          jsonProperties: jsonProperties,
          title: layerName ?? "",
          onClose: handlePopoverClose,
        })
      );
    } else {
      setHighlightedFeature(null);
      dispatch(setPopupInfo(undefined));
    }
  };

  const handleMapLoad = useCallback(() => {
    if (mapRef.current) {
      // get all icon layers and add icons to map using addOrUpdateMarkerImages method
      projectLayers?.forEach((layer) => {
        if (layer.type === "feature" && layer.feature_layer_geometry_type === "point") {
          const pointFeatureProperties = layer.properties as FeatureLayerPointProperties;
          addOrUpdateMarkerImages(pointFeatureProperties, mapRef.current);
        }
      });

      // load pattern images
      addPatternImages(PATTERN_IMAGES ?? [], mapRef.current);
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
    dispatch(setPopupInfo(undefined));
    dispatch(setHighlightedFeature(undefined));
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

  useJobStatus(() => {
    mutateProjectLayers();
    mutateProject();
  });

  return (
    <>
      {isLoading && <LoadingPage />}
      {!isLoading && !hasError && (
        <MapProvider>
          <DrawProvider>
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
              }}>
              <Box>
                <ProjectNavigation projectId={projectId} />
              </Box>
              <Box
                sx={{
                  width: "100%",
                  ".maplibregl-ctrl .maplibregl-ctrl-logo": {
                    display: "none",
                  },
                  height: `calc(100% - ${toolbarHeight}px)`,
                  ".maplibregl-popup-content": {
                    padding: 0,
                    borderRadius: "6px",
                    background: theme.palette.background.paper,
                  },
                  ".maplibregl-popup-anchor-top .maplibregl-popup-tip, .maplibregl-popup-anchor-top-left .maplibregl-popup-tip, .maplibregl-popup-anchor-top-right .maplibregl-popup-tip":
                    {
                      borderBottomColor: theme.palette.background.paper,
                    },
                  ".maplibregl-popup-anchor-bottom .maplibregl-popup-tip, .maplibregl-popup-anchor-bottom-right .maplibregl-popup-tip, .maplibregl-popup-anchor-bottom-left .maplibregl-popup-tip":
                    {
                      borderTopColor: theme.palette.background.paper,
                    },
                  ".maplibregl-popup-anchor-left .maplibregl-popup-tip": {
                    borderRightColor: theme.palette.background.paper,
                  },
                  ".maplibregl-popup-anchor-right .maplibregl-popup-tip": {
                    borderLeftColor: theme.palette.background.paper,
                  },
                }}>
                <Map
                  id="map"
                  ref={mapRef}
                  style={{ width: "100%", height: "100%" }}
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
                  mapStyle={activeBasemap?.url}
                  interactiveLayerIds={interactiveLayerIds}
                  dragRotate={false}
                  touchZoomRotate={false}
                  onMoveEnd={updateViewState}
                  onClick={handleMapClick}
                  onMouseMove={handleMapOverImmediate}
                  onLoad={handleMapLoad}>
                  <DrawControl
                    position="top-right"
                    displayControlsDefault={false}
                    defaultMode={MapboxDraw.constants.modes.SIMPLE_SELECT}
                  />
                  <Layers
                    layers={projectLayers}
                    highlightFeature={highlightedFeature}
                    scenarioFeatures={scenarioFeatures}
                    selectedScenarioLayer={selectedScenarioEditLayer}
                  />
                  <ScenarioLayer scenarioLayerData={scenarioFeatures} projectLayers={projectLayers} />
                  <ToolboxLayers />
                  {popupInfo && <MapPopoverInfo key={highlightedFeature?.id ?? v4()} {...popupInfo} />}
                  {popupEditor && (
                    <MapPopoverEditor
                      key={popupEditor.feature?.id || popupEditor.feature?.properties?.id || v4()}
                      {...popupEditor}
                    />
                  )}
                </Map>
              </Box>
            </Box>
          </DrawProvider>
        </MapProvider>
      )}
    </>
  );
}
