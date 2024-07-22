import {
  Box, // Table,
  // TableBody,
  // TableCell,
  // TableContainer,
  // TableHead,
  // TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { toast } from "react-toastify";
import { ZodError } from "zod";

import { ICON_NAME } from "@p4b/ui/components/Icon";

import { useTranslation } from "@/i18n/client";

import {
  createProjectScenarioFeatures,
  deleteProjectScenarioFeature,
  updateProjectScenarioFeatures,
  useProjectLayers,
  useProjectScenarioFeatures,
} from "@/lib/api/projects";
import { setPopupEditor, setSelectedScenarioLayer } from "@/lib/store/map/slice";
import { stringify as stringifyToWKT } from "@/lib/utils/map/wkt";
import {
  type Scenario, // type ScenarioFeatures,
  scenarioEditTypeEnum,
  scenarioFeaturePost,
  scenarioFeatureUpdate,
} from "@/lib/validations/scenario";

import type { SelectorItem } from "@/types/map/common";
import { EditorModes } from "@/types/map/popover";

import { useAppDispatch, useAppSelector } from "@/hooks/store/ContextHooks";

import SectionHeader from "@/components/map/panels/common/SectionHeader";
import SectionOptions from "@/components/map/panels/common/SectionOptions";
import Selector from "@/components/map/panels/common/Selector";
import { getLayerIcon } from "@/components/map/panels/layer/Layer";
import FeatureEditorTools from "@/components/map/panels/scenario/FeatureEditorTools";

// const ScenarioFeaturesTable = ({ scenarioFeatures }: { scenarioFeatures: ScenarioFeatures | undefined }) => {
//   const { t } = useTranslation("common");
//   return (
//     <>
//       <Table size="small" aria-label="scenario features table" stickyHeader>
//         <TableHead>
//           <TableRow>
//             <TableCell align="left">
//               <Typography variant="caption" fontWeight="bold">
//                 Layer
//               </Typography>
//             </TableCell>
//             <TableCell align="left">
//               <Typography variant="caption" fontWeight="bold">
//                 Type
//               </Typography>
//             </TableCell>
//             <TableCell align="right"> </TableCell>
//           </TableRow>
//         </TableHead>
//       </Table>

//       <TableContainer style={{ marginTop: 0, maxHeight: 250 }}>
//         <Table size="small" aria-label="scenario features table">
//           <TableBody>
//             {!scenarioFeatures?.features?.length && (
//               <TableRow>
//                 <TableCell align="center" colSpan={3}>
//                   <Typography variant="caption" fontWeight="bold">
//                     {t("no_scenario_features")}
//                   </Typography>
//                 </TableCell>
//               </TableRow>
//             )}
//             {/* Scenario Feature Table  */}
//             {!scenarioFeatures
//               ? null
//               : scenarioFeatures.features.map((_feature, index) => (
//                   <TableRow key={index}>
//                     <TableCell align="center" sx={{ px: 2 }}>
//                       <Typography variant="caption" fontWeight="bold">
//                         1
//                       </Typography>
//                     </TableCell>
//                     <TableCell align="center" sx={{ px: 2 }}>
//                       <Typography variant="caption" fontWeight="bold">
//                         2
//                       </Typography>
//                     </TableCell>
//                     <TableCell align="right" sx={{ px: 2 }}>
//                       <Typography variant="caption" fontWeight="bold">
//                         3
//                       </Typography>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </>
//   );
// };

const ScenarioFeaturesEditor = ({ scenario, projectId }: { scenario: Scenario; projectId: string }) => {
  const theme = useTheme();
  const { t } = useTranslation("common");
  const dispatch = useAppDispatch();
  const { layers: projectLayers } = useProjectLayers(projectId);
  const { scenarioFeatures, mutate: mutateScenarioFeatures } = useProjectScenarioFeatures(
    projectId,
    scenario.id
  );
  const selectedScenarioEditLayer = useAppSelector((state) => state.map.selectedScenarioLayer);
  const popupEditor = useAppSelector((state) => state.map.popupEditor);
  const popupEditorRef = useRef(popupEditor);

  useEffect(() => {
    popupEditorRef.current = popupEditor;
  }, [popupEditor]);

  const scenarioEditLayers = useMemo(() => {
    const scenarioLayers = [] as SelectorItem[];
    if (projectLayers) {
      projectLayers.forEach((layer) => {
        if (layer.type === "feature") {
          layer.feature_layer_geometry_type;
          scenarioLayers.push({
            value: layer.id,
            label: layer.name,
            icon: getLayerIcon(layer),
          });
        }
      });
    }

    return scenarioLayers;
  }, [projectLayers]);

  const selectedScenarioLayer = useMemo(() => {
    if (selectedScenarioEditLayer) {
      return projectLayers?.find((layer) => layer.id === selectedScenarioEditLayer.value);
    }
  }, [selectedScenarioEditLayer, projectLayers]);

  const handleSubmit = useCallback(async (payload) => {
    dispatch(setPopupEditor(undefined));
    if (popupEditorRef.current) {
      const type = popupEditorRef.current.editMode;
      const properties = popupEditorRef.current.feature?.properties;
      if (
        type === EditorModes.DELETE &&
        popupEditorRef.current.feature &&
        properties &&
        popupEditorRef.current.projectLayer
      ) {
        try {
          await deleteProjectScenarioFeature(
            projectId,
            popupEditorRef.current.projectLayer?.id,
            scenario.id,
            properties.id
          );
          toast.success(t("feature_deleted_success"));
        } catch (error) {
          console.error(error);
          toast.error(t("feature_delete_error"));
        } finally {
          mutateScenarioFeatures();
        }
      } else if (
        (type === EditorModes.MODIFY_ATTRIBUTES || type === EditorModes.MODIFY_GEOMETRY) &&
        payload
      ) {
        try {
          const { layer_id, ...updatedPayload } = payload;
          const updateFeature = scenarioFeatureUpdate.parse({
            ...updatedPayload,
            edit_type: properties?.edit_type || scenarioEditTypeEnum.Enum.m,
            layer_project_id: popupEditorRef.current.projectLayer?.id,
          });
          await updateProjectScenarioFeatures(
            projectId,
            popupEditorRef.current.projectLayer?.id,
            scenario.id,
            [updateFeature]
          );
          toast.success(t("feature_updated_success"));
        } catch (error) {
          if (error instanceof ZodError) {
            console.error("Parse error details:", error.errors);
          } else {
            console.error("Unexpected error:", error);
          }
          toast.error(t("feature_update_error"));
        } finally {
          mutateScenarioFeatures();
        }
      } else if (type === EditorModes.DRAW && payload) {
        try {
          const geom = popupEditorRef.current.feature?.geometry;
          if (!geom) {
            throw new Error("Feature geometry is missing");
          }
          const createFeature = scenarioFeaturePost.parse({
            ...payload,
            edit_type: scenarioEditTypeEnum.Enum.n,
            layer_project_id: popupEditorRef.current.projectLayer?.id,
            geom: stringifyToWKT(geom),
          });
          await createProjectScenarioFeatures(
            projectId,
            popupEditorRef.current.projectLayer?.id,
            scenario.id,
            [createFeature]
          );
          toast.success(t("feature_created_success"));
        } catch (error) {
          if (error instanceof ZodError) {
            console.error("Parse error details:", error.errors);
          } else {
            console.error("Unexpected error:", error);
          }
          toast.error(t("feature_create_error"));
        } finally {
          mutateScenarioFeatures();
        }
      }
    }
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}>
      <Typography variant="body2" sx={{ fontStyle: "italic", marginBottom: theme.spacing(4) }}>
        GOAT allows the development of custom scenarios which can later be used for computing indicators to
        assess the impact of the interventions.
      </Typography>
      <SectionHeader
        active={true}
        alwaysActive={true}
        label={t("layer")}
        icon={ICON_NAME.LAYERS}
        disableAdvanceOptions={true}
      />
      <SectionOptions
        active={true}
        baseOptions={
          <>
            <Selector
              selectedItems={selectedScenarioEditLayer}
              setSelectedItems={(item: SelectorItem[] | SelectorItem | undefined) => {
                dispatch(setSelectedScenarioLayer(item as SelectorItem));
              }}
              items={scenarioEditLayers}
              label={t("select_layer")}
              placeholder={t("select_layer")}
              tooltip={t("select_layer_for_scenario")}
            />
          </>
        }
      />

      {/* {EDIT TOOLS} */}
      <SectionHeader
        active={selectedScenarioEditLayer !== undefined}
        alwaysActive={true}
        label={t("edit_tools")}
        icon={ICON_NAME.SCENARIO}
        disableAdvanceOptions={true}
      />
      <SectionOptions
        active={selectedScenarioEditLayer !== undefined}
        baseOptions={
          <>
            {selectedScenarioLayer !== undefined && (
              <FeatureEditorTools
                projectLayer={selectedScenarioLayer}
                scenarioFeatures={scenarioFeatures}
                onFinish={handleSubmit}
              />
            )}
          </>
        }
      />

      {/* {SCENARIO FEATURES} */}
      {/* <SectionHeader
        active={true}
        alwaysActive={true}
        label={t("scenario_features")}
        icon={ICON_NAME.TABLE}
        disableAdvanceOptions={true}
      />

      <SectionOptions
        active={scenarioFeatures !== undefined}
        baseOptions={
          <>
            <ScenarioFeaturesTable scenarioFeatures={scenarioFeatures} />
          </>
        }
      /> */}
    </Box>
  );
};

export default ScenarioFeaturesEditor;
