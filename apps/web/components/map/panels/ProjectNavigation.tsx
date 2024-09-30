import { Box, Collapse, Stack, useTheme } from "@mui/material";
import React, { useMemo, useRef } from "react";

import { ICON_NAME } from "@p4b/ui/components/Icon";

import { useTranslation } from "@/i18n/client";

import { MAPBOX_TOKEN } from "@/lib/constants";
import { setActiveBasemap, setActiveLeftPanel, setActiveRightPanel } from "@/lib/store/map/slice";
import { layerType } from "@/lib/validations/common";
import { FeatureName } from "@/lib/validations/organization";

import { MapSidebarItemID } from "@/types/map/common";

import { useAuthZ } from "@/hooks/auth/AuthZ";
import { useActiveLayer } from "@/hooks/map/LayerPanelHooks";
import { useAppDispatch, useAppSelector } from "@/hooks/store/ContextHooks";

import MapSidebar from "@/components/map/Sidebar";
import { BasemapSelector } from "@/components/map/controls/BasemapSelector";
import { Fullscren } from "@/components/map/controls/Fullscreen";
import Geocoder from "@/components/map/controls/Geocoder";
import { Zoom } from "@/components/map/controls/Zoom";
import Legend from "@/components/map/panels/Legend";
import Filter from "@/components/map/panels/filter/Filter";
import LayerPanel from "@/components/map/panels/layer/Layer";
import PropertiesPanel from "@/components/map/panels/properties/Properties";
import Scenario from "@/components/map/panels/scenario/Scenario";
import LayerStyle from "@/components/map/panels/style/LayerStyle";
import Toolbox from "@/components/map/panels/toolbox/Toolbox";

import type { MapSidebarProps } from "../Sidebar";

const sidebarWidth = 52;
const toolbarHeight = 52;

const ProjectNavigation = ({ projectId }) => {
  const theme = useTheme();
  const { t, i18n } = useTranslation("common");
  const dispatch = useAppDispatch();
  const basemaps = useAppSelector((state) => state.map.basemaps);
  const activeBasemap = useAppSelector((state) => state.map.activeBasemap);
  const activeLeft = useAppSelector((state) => state.map.activeLeftPanel);
  const activeRight = useAppSelector((state) => state.map.activeRightPanel);
  const { activeLayer } = useActiveLayer(projectId);

  const prevActiveLeftRef = useRef<MapSidebarItemID | undefined>(undefined);
  const prevActiveRightRef = useRef<MapSidebarItemID | undefined>(undefined);
  const { isProjectEditor, isAppFeatureEnabled } = useAuthZ();

  const leftSidebar: MapSidebarProps = {
    topItems: [
      {
        id: MapSidebarItemID.LAYERS,
        icon: ICON_NAME.LAYERS,
        name: t("layers"),
        component: <LayerPanel projectId={projectId} />,
      },
      {
        id: MapSidebarItemID.LEGEND,
        icon: ICON_NAME.LEGEND,
        name: t("legend"),
        component: <Legend projectId={projectId} />,
      },
    ],
    bottomItems: [],
    width: sidebarWidth,
    position: "left",
  };

  const translatedBaseMaps = useMemo(() => {
    return basemaps.map((basemap) => ({
      ...basemap,
      title: i18n.exists(`common:basemap_types.${basemap.value}.title`)
        ? t(`basemap_types.${basemap.value}.title`)
        : t(basemap.title),
      subtitle: i18n.exists(`common:basemap_types.${basemap.value}.subtitle`)
        ? t(`basemap_types.${basemap.value}.subtitle`)
        : t(basemap.subtitle),
    }));
  }, [basemaps, i18n, t]);

  const rightSidebar: MapSidebarProps = {
    topItems: [
      {
        id: MapSidebarItemID.PROPERTIES,
        icon: ICON_NAME.SLIDERS,
        name: t("properties"),
        component: <PropertiesPanel projectId={projectId} />,
        disabled: !activeLayer,
      },
      {
        id: MapSidebarItemID.FILTER,
        icon: ICON_NAME.FILTER,
        name: t("filter"),
        component: <Filter projectId={projectId} />,
        disabled: !activeLayer || activeLayer?.type !== layerType.Values.feature,
      },
      {
        id: MapSidebarItemID.STYLE,
        icon: ICON_NAME.STYLE,
        name: t("layer_design"),
        component: <LayerStyle projectId={projectId} />,
        disabled: !activeLayer || activeLayer?.type !== layerType.Values.feature,
      },
      {
        id: MapSidebarItemID.TOOLBOX,
        icon: ICON_NAME.TOOLBOX,
        name: t("tools"),
        component: <Toolbox />,
      },
      {
        id: MapSidebarItemID.SCENARIO,
        icon: ICON_NAME.SCENARIO,
        name: t("scenario"),
        component: <Scenario projectId={projectId} />,
        disabled: !isAppFeatureEnabled(FeatureName.SCENARIO),
      },
    ],
    width: sidebarWidth,
    position: "right",
  };

  const activeRightComponent = useMemo(() => {
    if (activeRight) {
      return rightSidebar.topItems?.find((item) => item.id === activeRight)?.component;
    } else if (prevActiveRightRef.current) {
      return rightSidebar.topItems?.find((item) => item.id === prevActiveRightRef.current)?.component;
    }
    return undefined;
  }, [activeRight, rightSidebar.topItems]);

  const activeLeftComponent = useMemo(() => {
    if (activeLeft) {
      return leftSidebar.topItems?.find((item) => item.id === activeLeft)?.component;
    } else if (prevActiveLeftRef.current) {
      return leftSidebar.topItems?.find((item) => item.id === prevActiveLeftRef.current)?.component;
    }
    return undefined;
  }, [activeLeft, leftSidebar.topItems]);

  return (
    <>
      {isProjectEditor && (
        <Box
          sx={{
            ".MuiDrawer-paper": {
              height: `calc(100% - ${toolbarHeight}px)`,
              marginTop: `${toolbarHeight}px`,
            },
            [theme.breakpoints.down("sm")]: {
              display: "none",
            },
          }}>
          <MapSidebar
            {...leftSidebar}
            active={activeLeft}
            onClick={(item) => {
              if (item.link) {
                window.open(item.link, "_blank");
                return;
              } else {
                dispatch(setActiveLeftPanel(item.id === activeLeft ? undefined : item.id));
              }
            }}
          />
        </Box>
      )}

      <Stack
        direction="row"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          height: "100%",
          position: "absolute",
          top: 0,
          pointerEvents: "all",
          ...(isProjectEditor && { left: sidebarWidth }),
          [theme.breakpoints.down("sm")]: {
            left: "0",
          },
        }}>
        {isProjectEditor && (
          <Collapse
            timeout={200}
            orientation="horizontal"
            in={activeLeft !== undefined}
            sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
            onExited={() => {
              dispatch(setActiveLeftPanel(undefined));
              prevActiveLeftRef.current = undefined;
            }}>
            {(activeLeft !== undefined || prevActiveLeftRef.current !== undefined) && (
              <Box
                sx={{
                  height: `calc(100% - ${toolbarHeight}px)`,
                  marginTop: `${toolbarHeight}px`,
                  width: 300,
                  pointerEvents: "all",
                }}>
                {activeLeftComponent}
              </Box>
            )}
          </Collapse>
        )}
        {/* Left Controls */}
        <Stack
          direction="column"
          sx={{
            height: `calc(100% - ${toolbarHeight}px)`,
            justifyContent: "space-between",
            marginTop: `${toolbarHeight}px`,
            padding: theme.spacing(4),
          }}>
          <Stack direction="column" sx={{ pointerEvents: "all" }}>
            <Geocoder accessToken={MAPBOX_TOKEN} placeholder={t("enter_an_address")} tooltip={t("search")} />
          </Stack>
          {!isProjectEditor && (
            <Stack direction="column" sx={{ pointerEvents: "all" }}>
              <Legend projectId={projectId} isFloating showAllLayers />
            </Stack>
          )}
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
          right: isProjectEditor ? sidebarWidth : 0,
          [theme.breakpoints.down("sm")]: {
            right: "0",
          },
        }}>
        <Stack
          direction="column"
          sx={{
            height: `calc(100% - ${toolbarHeight}px)`,
            justifyContent: "space-between",
            marginTop: `${toolbarHeight}px`,
            padding: theme.spacing(4),
          }}>
          <Stack direction="column" sx={{ pointerEvents: "all" }}>
            <Zoom tooltipZoomIn={t("zoom_in")} tooltipZoomOut={t("zoom_out")} />
            <Fullscren tooltipOpen={t("fullscreen")} tooltipExit={t("exit_fullscreen")} />
          </Stack>
          <Stack direction="column" sx={{ pointerEvents: "all" }}>
            <BasemapSelector
              styles={translatedBaseMaps}
              active={activeBasemap}
              basemapChange={(basemap) => {
                dispatch(setActiveBasemap(basemap));
              }}
            />
          </Stack>
        </Stack>
        {isProjectEditor && (
          <Collapse
            timeout={200}
            orientation="horizontal"
            in={activeRight !== undefined}
            onExit={() => {
              dispatch(setActiveRightPanel(undefined));
              prevActiveRightRef.current = undefined;
            }}>
            {(activeRight !== undefined || prevActiveRightRef.current !== undefined) && (
              <Box
                sx={{
                  height: `calc(100% - ${toolbarHeight}px)`,
                  marginTop: `${toolbarHeight}px`,
                  width: 300,
                  pointerEvents: "all",
                }}>
                {activeRightComponent}
              </Box>
            )}
          </Collapse>
        )}
      </Stack>
      {isProjectEditor && (
        <Box
          sx={{
            ".MuiDrawer-paper": {
              height: `calc(100% - ${toolbarHeight}px)`,
              marginTop: `${toolbarHeight}px`,
            },
            [theme.breakpoints.down("sm")]: {
              display: "none",
            },
          }}>
          <MapSidebar
            {...rightSidebar}
            active={activeRight}
            onClick={(item) => {
              if (item.link) {
                window.open(item.link, "_blank");
                return;
              } else {
                dispatch(setActiveRightPanel(item.id === activeRight ? undefined : item.id));
              }
            }}
          />
        </Box>
      )}
    </>
  );
};

export default ProjectNavigation;
