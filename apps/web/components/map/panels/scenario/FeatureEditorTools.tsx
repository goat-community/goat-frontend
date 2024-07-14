import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { Stack, ToggleButton, ToggleButtonGroup, Tooltip, useTheme } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";

import { ICON_NAME, Icon } from "@p4b/ui/components/Icon";

import { useTranslation } from "@/i18n/client";

import { useDraw } from "@/lib/providers/DrawProvider";
import type { ProjectLayer } from "@/lib/validations/project";
import type { ScenarioFeatures } from "@/lib/validations/scenario";

import FormLabelHelper from "@/components/common/FormLabelHelper";
import { CustomDrawModes } from "@/components/map/controls/draw/Draw";

export type FeatureEditorToolsProps = {
  projectLayer: ProjectLayer;
  scenarioFeatures?: ScenarioFeatures;
  onFinish?: () => void;
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

export const EditorModes = {
  DRAW: "draw",
  EDIT: "edit",
  MODIFY_ATTRIBUTES: "modify_attributes",
  DELETE: "delete",
};

const FeatureEditorTools = ({
  projectLayer: _projectLayer,
  scenarioFeatures: _scenarioFeatures,
  onFinish,
  disabled,
}: FeatureEditorToolsProps) => {
  const [projectLayer, setProjectLayer] = useState<ProjectLayer | null>(_projectLayer);

  const { t } = useTranslation("common");
  const theme = useTheme();
  const { drawControl } = useDraw();

  const selectTools = useMemo(
    () => [
      {
        title: t("draw_circle"),
        mode: SelectModes.DRAW_CIRCLE,
        icon: ICON_NAME.CIRCLE,
      },
    ],
    [t]
  );

  const editTools = useMemo(
    () => [
      { title: t("draw"), mode: EditorModes.DRAW, icon: ICON_NAME.PLUS },
      { title: t("edit"), mode: EditorModes.EDIT, icon: ICON_NAME.EDIT },
      {
        title: t("modify_attributes"),
        mode: EditorModes.MODIFY_ATTRIBUTES,
        icon: ICON_NAME.TABLE,
      },
      { title: t("delete"), mode: EditorModes.DELETE, icon: ICON_NAME.TRASH },
    ],
    [t]
  );

  const [editType, setEditType] = useState<string | null>(null);
  const [selectType, setSelectType] = useState<string | null>(null);

  const clean = useCallback(() => {
    setEditType(null);
    setSelectType(null);
    drawControl?.deleteAll();
    drawControl?.changeMode(MapboxDraw.constants.modes.SIMPLE_SELECT);
  }, [drawControl]);

  useEffect(() => {
    if (projectLayer && projectLayer?.id !== _projectLayer.id) {
      setProjectLayer(_projectLayer);
      clean();
    }
  }, [_projectLayer, clean, editType, projectLayer, projectLayer?.id, selectType]);

  return (
    <Stack spacing={4}>
      <Stack>
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
      </Stack>

      <Stack>
        <FormLabelHelper
          label={t("feature_editor_tools")}
          color={disabled ? theme.palette.secondary.main : "inherit"}
        />
        <ToggleButtonGroup
          value={editType}
          exclusive
          aria-label="feature editor tools"
          onChange={(_event: React.MouseEvent<HTMLElement>, newEditType: string | null) => {
            setSelectType(null);
            const geomType = projectLayer?.feature_layer_geometry_type;
            if (!geomType) {
              return;
            }
            if (newEditType === EditorModes.DRAW) {
              const mapboxDrawMode = `DRAW_${toMapDrawModeGeometryType[geomType]}`;
              drawControl?.changeMode(MapboxDraw.constants.modes[mapboxDrawMode]);
            }
            setEditType(newEditType);
          }}>
          {editTools.map((tool) => (
            <Tooltip key={tool.mode} title={tool.title} placement="top" arrow>
              <ToggleButton value={tool.mode}>
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
