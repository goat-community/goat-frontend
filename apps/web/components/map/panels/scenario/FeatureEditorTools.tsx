import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { Stack, ToggleButton, ToggleButtonGroup, Tooltip, useTheme } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { MapGeoJSONFeature, MapLayerMouseEvent } from "react-map-gl";
import { useMap } from "react-map-gl";

import { ICON_NAME, Icon } from "@p4b/ui/components/Icon";

import { useTranslation } from "@/i18n/client";

import { useDraw } from "@/lib/providers/DrawProvider";
import { setIsMapGetInfoActive, setPopupEditor } from "@/lib/store/map/slice";
import type { ProjectLayer } from "@/lib/validations/project";
import type { ScenarioFeatures } from "@/lib/validations/scenario";

import { EditorModes } from "@/types/map/popover";

import { useAppDispatch } from "@/hooks/store/ContextHooks";

import FormLabelHelper from "@/components/common/FormLabelHelper";
import { CustomDrawModes } from "@/components/map/controls/draw/Draw";

export type FeatureEditorToolsProps = {
  projectLayer: ProjectLayer;
  scenarioFeatures?: ScenarioFeatures;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFinish?: (payload?: any) => void;
  disabled?: boolean;
};

export const SelectModes = {
  DRAW_CIRCLE: CustomDrawModes.DRAW_CIRCLE,
};

export const toMapDrawModeGeometryType = {
  point: "POINT",
  line: "LINE_STRING",
  polygon: "POLYGON",
};

const FeatureEditorTools = ({
  projectLayer: _projectLayer,
  scenarioFeatures: _scenarioFeatures,
  onFinish,
  disabled,
}: FeatureEditorToolsProps) => {
  const [projectLayer, setProjectLayer] = useState<ProjectLayer | null>(_projectLayer);
  const { map } = useMap();
  const { t } = useTranslation("common");
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { drawControl } = useDraw();

  // const selectTools = useMemo(
  //   () => [
  //     {
  //       title: t("draw_circle"),
  //       mode: SelectModes.DRAW_CIRCLE,
  //       icon: ICON_NAME.CIRCLE,
  //     },
  //   ],
  //   [t]
  // );

  const editTools = useMemo(
    () => [
      { title: t("draw"), mode: EditorModes.DRAW, icon: ICON_NAME.PLUS },
      { title: t("modify_geometry"), mode: EditorModes.MODIFY_GEOMETRY, icon: ICON_NAME.EDIT },
      {
        title: t("modify_attributes"),
        mode: EditorModes.MODIFY_ATTRIBUTES,
        icon: ICON_NAME.TABLE,
      },
      { title: t("delete"), mode: EditorModes.DELETE, icon: ICON_NAME.TRASH },
    ],
    [t]
  );

  const [editType, setEditType] = useState<EditorModes | null>(null);
  const [selectType, setSelectType] = useState<string | null>(null);

  const clean = useCallback(() => {
    setEditType(null);
    setSelectType(null);
    dispatch(setIsMapGetInfoActive(true));
    drawControl?.deleteAll();
    drawControl?.changeMode(MapboxDraw.constants.modes.SIMPLE_SELECT);
  }, [dispatch, drawControl]);

  useEffect(() => {
    if (projectLayer && projectLayer?.id !== _projectLayer.id) {
      setProjectLayer(_projectLayer);
      clean();
    }
  }, [_projectLayer, clean, editType, projectLayer, projectLayer?.id, selectType]);

  const reenableDraw = useCallback(
    (drawControl: MapboxDraw | null, newEditType: EditorModes | null) => {
      drawControl?.deleteAll();
      const geomType = projectLayer?.feature_layer_geometry_type;
      if (!geomType) {
        return;
      }
      if (newEditType === EditorModes.DRAW) {
        const mapboxDrawMode = `DRAW_${toMapDrawModeGeometryType[geomType]}`;
        drawControl?.changeMode(MapboxDraw.constants.modes[mapboxDrawMode]);
      }
    },
    [projectLayer?.feature_layer_geometry_type]
  );

  const handleFeatureClick = useCallback(
    (e: MapLayerMouseEvent) => {
      const features = map?.queryRenderedFeatures(e.point);
      const layerId = projectLayer?.id.toString();
      if (!features || !layerId) {
        return;
      }
      const selectedEditFeatures = features?.filter(
        (feature) =>
          feature.layer.id &&
          (feature.layer.id === layerId ||
            feature.layer.id === `scenario-layer-${layerId}` ||
            feature.layer.id === `highlight-scenario-point-layer-${layerId}` ||
            feature.layer.id === `highlight-scenario-pattern-layer-${layerId}`)
      );
      if (selectedEditFeatures?.length && editType) {
        dispatch(
          setPopupEditor({
            lngLat: [e.lngLat.lng, e.lngLat.lat],
            editMode: editType,
            projectLayer: projectLayer as ProjectLayer,
            feature: selectedEditFeatures[0] as MapGeoJSONFeature,
            onClose: () => {
              dispatch(setPopupEditor(undefined));
            },
            onConfirm: (payload) => {
              onFinish && onFinish(payload);
            },
          })
        );
      }
    },
    [map, projectLayer, editType, dispatch, onFinish]
  );

  const handleFeatureCreate = useCallback(
    (e: { features: object[] }) => {
      const feature = e.features[0] as MapGeoJSONFeature;
      if (feature) {
        let lngLat = map?.getCenter();
        const coordinates = feature.geometry["coordinates"];
        if (projectLayer?.feature_layer_geometry_type === "point") {
          lngLat = coordinates;
        } else if (projectLayer?.feature_layer_geometry_type === "line") {
          const lastCoordinate = coordinates[coordinates.length - 1];
          lngLat = lastCoordinate;
        } else if (projectLayer?.feature_layer_geometry_type === "polygon") {
          const lastCoordinate = coordinates[0][coordinates[0].length - 1];
          lngLat = lastCoordinate;
        }
        setTimeout(() => {
          dispatch(
            setPopupEditor({
              lngLat: lngLat,
              editMode: editType,
              projectLayer: projectLayer as ProjectLayer,
              feature: feature,
              onClose: () => {
                drawControl?.deleteAll();
                dispatch(setPopupEditor(undefined));
                reenableDraw(drawControl, editType);
              },
              onConfirm: (payload) => {
                drawControl?.deleteAll();
                onFinish && onFinish(payload);
                reenableDraw(drawControl, editType);
              },
            })
          );
        }, 100);
      }
    },
    [map, projectLayer, editType, dispatch, drawControl, onFinish, reenableDraw]
  );

  useEffect(() => {
    if (!map) {
      return;
    }
    if (editType === EditorModes.DELETE || editType === EditorModes.MODIFY_ATTRIBUTES) {
      map.on("click", handleFeatureClick);
      dispatch(setIsMapGetInfoActive(false));
      return () => {
        map.off("click", handleFeatureClick);
        dispatch(setIsMapGetInfoActive(true));
      };
    }
    if (editType === EditorModes.DRAW) {
      map.on(MapboxDraw.constants.events.CREATE, handleFeatureCreate);
      return () => {
        map.off(MapboxDraw.constants.events.CREATE, handleFeatureCreate);
      };
    }
  }, [map, editType, handleFeatureClick, dispatch, handleFeatureCreate]);

  return (
    <Stack spacing={4}>
      {/* <Stack>
        <FormLabelHelper
          label={t("select_features_to_edit_tools")}
          color={disabled ? theme.palette.secondary.main : "inherit"}
        />

        <ToggleButtonGroup
          value={selectType}
          exclusive
          aria-label="feature select tools"
          onChange={(_event: React.MouseEvent<HTMLElement>, newSelectType: string | null) => {
            setSelectType(newSelectType);
            if (newSelectType === SelectModes.DRAW_CIRCLE) {
              drawControl?.changeMode(CustomDrawModes.DRAW_CIRCLE);
            } else {
              drawControl?.changeMode(MapboxDraw.constants.modes.SIMPLE_SELECT);
            }
            setEditType(null);
          }}>
          {selectTools.map((tool) => (
            <Tooltip key={tool.mode} title={tool.title} placement="top" arrow>
              <ToggleButton value={tool.mode}>
                <Icon fontSize="inherit" iconName={tool.icon} />
              </ToggleButton>
            </Tooltip>
          ))}
        </ToggleButtonGroup>
      </Stack> */}

      <Stack>
        <FormLabelHelper
          label={t("feature_editor_tools")}
          color={disabled ? theme.palette.secondary.main : "inherit"}
        />
        <ToggleButtonGroup
          value={editType}
          exclusive
          aria-label="feature editor tools"
          onChange={(_event: React.MouseEvent<HTMLElement>, newEditType: EditorModes | null) => {
            setSelectType(null);
            dispatch(setPopupEditor(undefined));
            reenableDraw(drawControl, newEditType);
            setEditType(newEditType);
          }}>
          {editTools.map((tool) => (
            <Tooltip key={tool.mode} title={tool.title} placement="top" arrow>
              <ToggleButton value={tool.mode} disabled={tool.mode === EditorModes.MODIFY_GEOMETRY}>
                <Icon fontSize="inherit" iconName={tool.icon} />
              </ToggleButton>
            </Tooltip>
          ))}
        </ToggleButtonGroup>
      </Stack>
    </Stack>
  );
};

export default FeatureEditorTools;
