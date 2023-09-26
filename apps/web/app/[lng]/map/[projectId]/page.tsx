"use client";

import type { MapSidebarProps } from "@/components/map/Sidebar";
import type { MapSidebarItem } from "@/types/map/sidebar";
import MapSidebar from "@/components/map/Sidebar";
import type { MapToolbarProps } from "@/components/map/Toolbar";
import type { XYZ_Layer } from "@/types/map/layer";
import { MapToolbar } from "@/components/map/Toolbar";
import { BasemapSelector } from "@/components/map/controls/BasemapSelector";
import { Zoom } from "@/components/map/controls/Zoom";
import Charts from "@/components/map/panels/Charts";
import Filter from "@/components/map/panels/filter/Filter";
import LayerPanel from "@/components/map/panels/Layer";
import Legend from "@/components/map/panels/Legend";
import Scenario from "@/components/map/panels/Scenario";
import Toolbox from "@/components/map/panels/Toolbox";
import { MAPBOX_TOKEN } from "@/lib/constants";
import { Box, Collapse, Stack, useTheme } from "@mui/material";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Map, { MapProvider, Layer, Source } from "react-map-gl";
import Layers from "@/components/map/Layers";
import MobileDrawer from "@/components/map/panels/MobileDrawer";

import { ICON_NAME } from "@p4b/ui/components/Icon";
import { Fullscren } from "@/components/map/controls/Fullscreen";
import Geocoder from "@/components/map/controls/Geocoder";
import { useSelector } from "react-redux";
import type { IStore } from "@/types/store";
import { setActiveBasemapIndex } from "@/lib/store/styling/slice";
import MapStyle from "@/components/map/panels/mapStyle/MapStyle";
import { fetchLayerData } from "@/lib/store/styling/actions";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { selectMapLayer } from "@/lib/store/styling/selectors";

const sidebarWidth = 48;
const toolbarHeight = 52;

export default function MapPage({ params: { projectId } }) {
  const { basemaps, activeBasemapIndex, initialViewState } = useSelector(
    (state: IStore) => state.styling,
  );
  const mapLayer = useSelector(selectMapLayer);

  const [activeLeft, setActiveLeft] = useState<MapSidebarItem | undefined>(
    undefined,
  );

  const [activeRight, setActiveRight] = useState<MapSidebarItem | undefined>(
    undefined,
  );

  const [layers, setLayers] = useState<XYZ_Layer[] | []>([
    {
      id: "layer1",
      sourceUrl:
        "https://geoapi.goat.dev.plan4better.de/collections/user_data.e66f60f87ec248faaebb8a8c64c29990/tiles/{z}/{x}/{y}",
      color: "#FF0000",
    },
  ]);

  const prevActiveLeftRef = useRef<MapSidebarItem | undefined>(undefined);
  const prevActiveRightRef = useRef<MapSidebarItem | undefined>(undefined);
  const dispatch = useAppDispatch();

  const theme = useTheme();

  const handleCollapse = useCallback(() => {
    setActiveLeft(undefined);
  }, []);

  const addLayer = useCallback((newLayer: XYZ_Layer[]) => {
    setLayers(newLayer);
  }, []);

  const toolbar: MapToolbarProps = {
    projectTitle: "@project_title",
    lastSaved: "08:35am 03/07/2023",
    tags: ["Bike Sharing Project", "City of Munich"],
    height: toolbarHeight,
  };

  const leftSidebar: MapSidebarProps = {
    topItems: [
      {
        icon: ICON_NAME.LAYERS,
        name: "Layers",
        component: (
          <LayerPanel
            onCollapse={handleCollapse}
            setActiveLeft={setActiveLeft}
          />
        ),
      },
      {
        icon: ICON_NAME.LEGEND,
        name: "Legend",
        component: <Legend setActiveLeft={setActiveLeft} />,
      },
      {
        icon: ICON_NAME.CHART,
        name: "Charts",
        component: <Charts setActiveLeft={setActiveLeft} />,
      },
    ],
    bottomItems: [
      {
        icon: ICON_NAME.HELP,
        name: "Help",
        link: "https://docs.plan4better.de",
      },
    ],
    width: sidebarWidth,
    position: "left",
  };

  const rightSidebar: MapSidebarProps = {
    topItems: [
      {
        icon: ICON_NAME.TOOLBOX,
        name: "Tools",
        component: <Toolbox setActiveRight={setActiveRight} />,
      },
      {
        icon: ICON_NAME.FILTER,
        name: "Filter",
        component: <Filter setActiveRight={setActiveRight} />,
      },
      {
        icon: ICON_NAME.SCENARIO,
        name: "Scenario",
        component: <Scenario setActiveRight={setActiveRight} />,
      },
      {
        icon: ICON_NAME.STYLE,
        name: "Map Style",
        component: (
          <MapStyle setActiveRight={setActiveRight} projectId={projectId} />
        ),
      },
    ],
    width: sidebarWidth,
    position: "right",
  };

  useEffect(() => {
    prevActiveLeftRef.current = activeLeft;
  }, [activeLeft]);

  useEffect(() => {
    prevActiveRightRef.current = activeRight;
  }, [activeRight]);

  useEffect(() => {
    if (projectId) {
      dispatch(fetchLayerData(projectId));
    }
  }, [dispatch, projectId]);

  return (
    <MapProvider>
      <MapToolbar {...toolbar} />
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
          <Box
            sx={{
              ".MuiDrawer-paper": {
                height: `calc(100% - ${toolbarHeight}px)`,
                marginTop: `${toolbarHeight}px`,
              },
              [theme.breakpoints.down("sm")]: {
                display: "none",
              },
            }}
          >
            <MapSidebar
              {...leftSidebar}
              active={activeLeft}
              onClick={(item) => {
                if (item.link) {
                  window.open(item.link, "_blank");
                  return;
                } else {
                  setActiveLeft(
                    item.name === activeLeft?.name ? undefined : item,
                  );
                }
              }}
            />
          </Box>

          <Stack
            direction="row"
            sx={{
              zIndex: (theme) => theme.zIndex.drawer + 1,
              height: "100%",
              position: "absolute",
              top: 0,
              pointerEvents: "all",
              left: sidebarWidth,
              [theme.breakpoints.down("sm")]: {
                left: "0",
              },
            }}
          >
            <Collapse
              timeout={200}
              orientation="horizontal"
              in={activeLeft !== undefined}
              sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
              onExited={() => {
                setActiveLeft(undefined);
                prevActiveLeftRef.current = undefined;
              }}
            >
              {(activeLeft?.component !== undefined ||
                prevActiveLeftRef.current?.component !== undefined) && (
                <Box
                  sx={{
                    height: `calc(100% - ${toolbarHeight}px)`,
                    marginTop: `${toolbarHeight}px`,
                    width: 300,
                    borderLeft: `1px solid ${theme.palette.secondary.dark}}`,
                    pointerEvents: "all",
                  }}
                >
                  {activeLeft?.component ||
                    prevActiveLeftRef.current?.component}
                </Box>
              )}
            </Collapse>
            {/* Left Controls */}
            <Stack
              direction="column"
              sx={{
                height: `calc(100% - ${toolbarHeight}px)`,
                justifyContent: "space-between",
                marginTop: `${toolbarHeight}px`,
                padding: theme.spacing(4),
              }}
            >
              <Stack direction="column" sx={{ pointerEvents: "all" }}>
                <Geocoder accessToken={MAPBOX_TOKEN} />
              </Stack>
            </Stack>
          </Stack>
          <Stack
            direction="row"
            sx={{
              zIndex: (theme) => theme.zIndex.drawer + 1,
              height: "100%",
              position: "absolute",
              top: 0,
              pointerEvents: "none",
              right: sidebarWidth,
              [theme.breakpoints.down("sm")]: {
                right: "0",
              },
            }}
          >
            <Stack
              direction="column"
              sx={{
                height: `calc(100% - ${toolbarHeight}px)`,
                justifyContent: "space-between",
                marginTop: `${toolbarHeight}px`,
                padding: theme.spacing(4),
              }}
            >
              <Stack direction="column" sx={{ pointerEvents: "all" }}>
                <Zoom />
                <Fullscren />
              </Stack>
              <Stack direction="column" sx={{ pointerEvents: "all" }}>
                <BasemapSelector
                  styles={basemaps}
                  active={activeBasemapIndex}
                  basemapChange={(basemap) => {
                    dispatch(setActiveBasemapIndex(basemap));
                  }}
                />
              </Stack>
            </Stack>
            <Collapse
              timeout={200}
              orientation="horizontal"
              in={activeRight !== undefined}
              onExit={() => {
                setActiveRight(undefined);
                prevActiveRightRef.current = undefined;
              }}
            >
              {(activeRight?.component !== undefined ||
                prevActiveRightRef.current?.component !== undefined) && (
                <Box
                  sx={{
                    height: `calc(100% - ${toolbarHeight}px)`,
                    marginTop: `${toolbarHeight}px`,
                    width: 300,
                    borderRight: `1px solid ${theme.palette.secondary.dark}`,
                    pointerEvents: "all",
                  }}
                >
                  {activeRight?.component ||
                    prevActiveRightRef.current?.component}
                </Box>
              )}
            </Collapse>
          </Stack>
          <Box
            sx={{
              ".MuiDrawer-paper": {
                height: `calc(100% - ${toolbarHeight}px)`,
                marginTop: `${toolbarHeight}px`,
              },
              [theme.breakpoints.down("sm")]: {
                display: "none",
              },
            }}
          >
            <MapSidebar
              {...rightSidebar}
              active={activeRight}
              onClick={(item) => {
                if (item.link) {
                  window.open(item.link, "_blank");
                  return;
                } else {
                  setActiveRight(
                    item.name === activeRight?.name ? undefined : item,
                  );
                }
              }}
            />
          </Box>
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
            <Layers layers={layers} addLayer={addLayer} />
          </Map>
        </Box>
      </Box>
      <Box>
        <MobileDrawer />
      </Box>
    </MapProvider>
  );
}
