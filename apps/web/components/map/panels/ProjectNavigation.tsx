import { MAPBOX_TOKEN } from "@/lib/constants";

import React, { useState, useRef, useCallback } from "react";
import { ICON_NAME } from "@p4b/ui/components/Icon";
import LayerPanel from "@/components/map/panels/layer/Layer";
import Legend from "@/components/map/panels/Legend";
import Charts from "@/components/map/panels/Charts";
import Toolbox from "@/components/map/panels/Toolbox";
import Filter from "@/components/map/panels/filter/Filter";
import Scenario from "@/components/map/panels/Scenario";
import MapStyle from "@/components/map/panels/mapStyle/MapStyle";
import MapSidebar from "@/components/map/Sidebar";
import { Zoom } from "@/components/map/controls/Zoom";
import Geocoder from "@/components/map/controls/Geocoder";
import { Fullscren } from "@/components/map/controls/Fullscreen";
import { BasemapSelector } from "@/components/map/controls/BasemapSelector";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { setActiveBasemapIndex } from "@/lib/store/styling/slice";

import { useTranslation } from "@/i18n/client";

import {
  Box,
  useTheme,
  Stack,
  Collapse,
  CircularProgress,
} from "@mui/material";

import type { MapSidebarItem } from "@/types/map/sidebar";
import type { MapSidebarProps } from "../Sidebar";
import type { IStore } from "@/types/store";

const sidebarWidth = 48;
const toolbarHeight = 52;

const ProjectNavigation = ({ projectId }) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { t } = useTranslation("maps");

  const { basemaps, activeBasemapIndex } = useSelector(
    (state: IStore) => state.styling,
  );

  const { loading: mapLoading } = useSelector(
    (state: IStore) => state.map
  );

  const [activeLeft, setActiveLeft] = useState<MapSidebarItem | undefined>(
    undefined,
  );

  const [activeRight, setActiveRight] = useState<MapSidebarItem | undefined>(
    undefined,
  );

  const prevActiveLeftRef = useRef<MapSidebarItem | undefined>(undefined);
  const prevActiveRightRef = useRef<MapSidebarItem | undefined>(undefined);

  const handleCollapse = useCallback(() => {
    setActiveLeft(undefined);
  }, []);

  const leftSidebar: MapSidebarProps = {
    topItems: [
      {
        icon: ICON_NAME.LAYERS,
        name: t("panels.layers.layers"),
        component: (
          <LayerPanel
            projectId={projectId} 
            onCollapse={handleCollapse}
            setActiveLeft={setActiveLeft}
          />
        ),
      },
      {
        icon: ICON_NAME.LEGEND,
        name: t("panels.legend.legend"),
        component: <Legend setActiveLeft={setActiveLeft} />,
      },
      {
        icon: ICON_NAME.CHART,
        name: t("panels.charts.charts"),
        component: <Charts setActiveLeft={setActiveLeft} />,
      },
    ],
    bottomItems: [
      {
        icon: ICON_NAME.HELP,
        name: t("help"),
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
        name: t("panels.tools.tools"),
        component: <Toolbox setActiveRight={setActiveRight} />,
      },
      {
        icon: ICON_NAME.FILTER,
        name: t("panels.filter.filter"),
        component: (
          <Filter
            setActiveRight={setActiveRight}
            projectId={projectId}
          />
        ),
      },
      {
        icon: ICON_NAME.SCENARIO,
        name: t("panels.scenario.scenario"),
        component: <Scenario setActiveRight={setActiveRight} />,
      },
      {
        icon: ICON_NAME.STYLE,
        name: t("panels.layer_design.layer_design"),
        component: (
          <MapStyle setActiveRight={setActiveRight} projectId={projectId} />
        ),
      },
    ],
    width: sidebarWidth,
    position: "right",
  };
  

  return (
    <>
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
              setActiveLeft(item.name === activeLeft?.name ? undefined : item);
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
              {activeLeft?.component || prevActiveLeftRef.current?.component}
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
          {/* <Stack direction="column" sx={{ pointerEvents: "all" }}>
          </Stack> */}
          <Stack direction="column" sx={{ pointerEvents: "all" }}>
            <Stack direction="row" sx={{ pointerEvents: "all" }}>
              {
                mapLoading ? (
                  <CircularProgress
                    size={35}
                    sx={{
                      color: theme.palette.primary.main,
                      marginRight: theme.spacing(5),
                      marginTop: theme.spacing(3),
                    }}
                  />
                ) : null
              }
              <Stack direction="column" sx={{ pointerEvents: "all" }}>
                <Zoom />
                <Fullscren />
              </Stack>
            </Stack>
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
              {activeRight?.component || prevActiveRightRef.current?.component}
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
    </>
  );
};

export default ProjectNavigation;
