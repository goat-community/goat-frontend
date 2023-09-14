"use client";

import type { MapSidebarItem, MapSidebarProps } from "@/components/map/Sidebar";
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
import { makeStyles } from "@/lib/theme";
import { Box, Collapse, Stack } from "@mui/material";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Map, { MapProvider } from "react-map-gl";
import type { CSSObject } from "tss-react";
import { ICON_NAME } from "@p4b/ui/components/Icon";
import { Fullscren } from "@/components/map/controls/Fullscreen";
import Geocoder from "@/components/map/controls/Geocoder";
import { useSelector } from "react-redux";
import type { IStore } from "@/types/store";
import { setActiveBasemapIndex, setIcon } from "@/lib/store/styling/slice";
import MapStyle from "@/components/map/panels/mapStyle/MapStyle";
import { fetchLayerData, getCollections } from "@/lib/store/styling/actions";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { selectMapLayer } from "@/lib/store/styling/selectors";
import Collections from "@/components/map/panels/Collections";
import Layers from "@/components/map/Layers";

const sidebarWidth = 48;
const toolbarHeight = 52;

export default function MapPage({ params: { projectId } }) {
  const {
    basemaps,
    activeBasemapIndex,
    initialViewState,
    collections,
    layersSource,
    mapLayers,
  } = useSelector((state: IStore) => state.styling);
  const mapLayer = useSelector(selectMapLayer);

  const [activeLeft, setActiveLeft] = useState<MapSidebarItem | undefined>(
    undefined,
  );

  const [activeRight, setActiveRight] = useState<MapSidebarItem | undefined>(
    undefined,
  );

  const sourceUrl = layersSource?.[projectId]?.tiles[0]?.replace("http", "https")


  const [layers, setLayers] = useState<XYZ_Layer[] | []>([
    {
      id: 'layer1',
      sourceUrl,
      color: "#FF0000",
    },
  ]);

  const prevActiveLeftRef = useRef<MapSidebarItem | undefined>(undefined);
  const prevActiveRightRef = useRef<MapSidebarItem | undefined>(undefined);
  const dispatch = useAppDispatch();

  const { classes, cx } = useStyles({ sidebarWidth, toolbarHeight });


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
        icon: ICON_NAME.MAP,
        name: "Collection",
        component: (
          <Collections collections={collections} onCollapse={handleCollapse} />
        ),
      },
      {
        icon: ICON_NAME.LAYERS,
        name: "Layers",
        component: <LayerPanel layers={mapLayers} onCollapse={handleCollapse} />,
      },
      {
        icon: ICON_NAME.LEGEND,
        name: "Legend",
        component: <Legend />,
      },
      {
        icon: ICON_NAME.CHART,
        name: "Charts",
        component: <Charts />,
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
        component: <Toolbox />,
      },
      {
        icon: ICON_NAME.FILTER,
        name: "Filter",
        component: <Filter />,
      },
      {
        icon: ICON_NAME.SCENARIO,
        name: "Scenario",
        component: <Scenario />,
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

  useEffect(() => {
    dispatch(getCollections());
  }, [dispatch]);



  return (
    <MapProvider>
      <div className={cx(classes.container)}>
        <Box>
          <MapToolbar {...toolbar} />
          <MapSidebar
            {...leftSidebar}
            className={classes.sidebar}
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

          <Stack
            direction="row"
            className={cx(classes.collapse, classes.collapseLeft)}
            sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
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
                <Box className={cx(classes.controls, classes.leftPanel)}>
                  {activeLeft?.component ||
                    prevActiveLeftRef.current?.component}
                </Box>
              )}
            </Collapse>
            {/* Left Controls */}
            <Stack
              direction="column"
              justifyContent="space-between"
              className={cx(classes.controls, classes.mapControls)}
            >
              <Stack direction="column" className={cx(classes.groupControl)}>
                <Geocoder accessToken={MAPBOX_TOKEN} />
              </Stack>
            </Stack>
          </Stack>
          <Stack
            direction="row"
            className={cx(classes.collapse, classes.collapseRight)}
            sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
          >
            <Stack
              direction="column"
              justifyContent="space-between"
              className={cx(classes.controls, classes.mapControls)}
            >
              <Stack direction="column" className={cx(classes.groupControl)}>
                <Zoom />
                <Fullscren />
              </Stack>
              <Stack direction="column" className={cx(classes.groupControl)}>
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
                <Box className={cx(classes.controls, classes.rightPanel)}>
                  {activeRight?.component ||
                    prevActiveRightRef.current?.component}
                </Box>
              )}
            </Collapse>
          </Stack>
          <MapSidebar
            {...rightSidebar}
            className={classes.sidebar}
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
        <div className={cx(classes.root)}>
          <Map
            id="map"
            style={{ width: "100%", height: "100%" }}
            initialViewState={initialViewState}
            mapStyle={basemaps[activeBasemapIndex[0]].url}
            attributionControl={false}
            mapboxAccessToken={MAPBOX_TOKEN}
            onLoad={(e) => {
              const changeIcon = (src: string) => {
                const map = e.target;

                const newImage = new Image();
                newImage.crossOrigin = "Anonymous";
                newImage.src = src;

                const xhr = new XMLHttpRequest();

                xhr.open("GET", src, true);
                xhr.onreadystatechange = () => {
                  if (xhr.readyState === 4 && xhr.status === 200) {
                    newImage.src = `data:image/svg+xml,${encodeURIComponent(
                      xhr.responseText,
                    )}`;
                  }
                };

                xhr.send();

                newImage.onload = () => {
                  if (map.hasImage("dentist-15")) {
                    map.removeImage("dentist-15");
                    map.addImage("dentist-15", newImage, { sdf: true });
                  }
                };
              };

              dispatch(setIcon(changeIcon));
            }}
          >
            <Layers layers={layers} addLayer={addLayer} projectId={projectId} mapLayer={mapLayer}/>
          </Map>
        </div>
      </div>
    </MapProvider>
  );
}

const useStyles = makeStyles<{ sidebarWidth: number; toolbarHeight: number }>({
  name: { MapPage },
})((theme, { sidebarWidth, toolbarHeight }) => {
  const offsetHeight: CSSObject = {
    height: `calc(100% - ${toolbarHeight}px)`,
    marginTop: toolbarHeight,
  };
  const offsetWidth: CSSObject = {
    width: `calc(100% - ${2 * sidebarWidth}px)`,
    marginLeft: sidebarWidth,
  };
  return {
    container: {
      display: "flex",
      height: "100vh",
      ...offsetWidth,
    },
    root: {
      ...offsetHeight,
      width: "100%",
      ".mapboxgl-ctrl .mapboxgl-ctrl-logo": {
        display: "none",
      },
    },
    sidebar: {
      ".MuiDrawer-paper": {
        ...offsetHeight,
      },
    },
    controls: {
      ...offsetHeight,
    },
    groupControl: {
      pointerEvents: "all",
    },
    mapControls: {
      padding: theme.spacing(4),
    },
    leftPanel: {
      width: 300,
      borderLeft: `2px solid ${theme.colors.palette.light.greyVariant1}`,
      pointerEvents: "all",
    },
    rightPanel: {
      width: 300,
      borderRight: `2px solid ${theme.colors.palette.light.greyVariant1}`,
      pointerEvents: "all",
    },
    collapse: {
      height: "100%",
      position: "absolute",
      top: 0,
      pointerEvents: "none",
    },
    collapseLeft: {
      left: sidebarWidth,
    },
    collapseRight: {
      right: sidebarWidth,
    },
  };
});
