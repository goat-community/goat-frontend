import MapboxDraw from "@mapbox/mapbox-gl-draw";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useMap } from "react-map-gl";

import { ICON_NAME } from "@p4b/ui/components/Icon";

import { useTranslation } from "@/i18n/client";

import { useProjectLayers, useProjectScenarioFeatures } from "@/lib/api/projects";
import type { Scenario, ScenarioFeatures } from "@/lib/validations/scenario";

import type { SelectorItem } from "@/types/map/common";

import SectionHeader from "@/components/map/panels/common/SectionHeader";
import SectionOptions from "@/components/map/panels/common/SectionOptions";
import Selector from "@/components/map/panels/common/Selector";
import { getLayerIcon } from "@/components/map/panels/layer/Layer";
import FeatureEditorTools from "@/components/map/panels/scenario/FeatureEditorTools";

const ScenarioFeaturesTable = ({ scenarioFeatures }: { scenarioFeatures: ScenarioFeatures | undefined }) => {
  const { t } = useTranslation("common");
  return (
    <>
      <Table size="small" aria-label="scenario features table" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell align="left">
              <Typography variant="caption" fontWeight="bold">
                Layer
              </Typography>
            </TableCell>
            <TableCell align="left">
              <Typography variant="caption" fontWeight="bold">
                Type
              </Typography>
            </TableCell>
            <TableCell align="right"> </TableCell>
          </TableRow>
        </TableHead>
      </Table>

      <TableContainer style={{ marginTop: 0, maxHeight: 250 }}>
        <Table size="small" aria-label="scenario features table">
          <TableBody>
            {!scenarioFeatures?.features?.length && (
              <TableRow>
                <TableCell align="center" colSpan={3}>
                  <Typography variant="caption" fontWeight="bold">
                    {t("no_scenario_features")}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {/* Scenario Feature Table  */}
            {!scenarioFeatures
              ? null
              : scenarioFeatures.features.map((_feature, index) => (
                  <TableRow key={index}>
                    <TableCell align="center" sx={{ px: 2 }}>
                      <Typography variant="caption" fontWeight="bold">
                        1
                      </Typography>
                    </TableCell>
                    <TableCell align="center" sx={{ px: 2 }}>
                      <Typography variant="caption" fontWeight="bold">
                        2
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ px: 2 }}>
                      <Typography variant="caption" fontWeight="bold">
                        3
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

const ScenarioFeaturesEditor = ({ scenario, projectId }: { scenario: Scenario; projectId: string }) => {
  const theme = useTheme();
  const [selectedEditLayer, setSelectedEditLayer] = useState<SelectorItem | undefined>(undefined);
  const { t } = useTranslation("common");
  const { map } = useMap();
  const { layers: projectLayers } = useProjectLayers(projectId);
  const { scenarioFeatures } = useProjectScenarioFeatures(projectId, scenario.id);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFeatureCreate = (e: any) => {
    console.log(e);
  };

  useEffect(() => {
    if (!map) return;
    map.on(MapboxDraw.constants.events.CREATE, handleFeatureCreate);
    return () => {
      map.off(MapboxDraw.constants.events.CREATE, handleFeatureCreate);
    };
  }, [map]);

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
    if (selectedEditLayer) {
      return projectLayers?.find((layer) => layer.id === selectedEditLayer.value);
    }
  }, [selectedEditLayer, projectLayers]);

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
              selectedItems={selectedEditLayer}
              setSelectedItems={(item: SelectorItem[] | SelectorItem | undefined) => {
                setSelectedEditLayer(item as SelectorItem);
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
        active={selectedEditLayer !== undefined}
        alwaysActive={true}
        label={t("edit_tools")}
        icon={ICON_NAME.SCENARIO}
        disableAdvanceOptions={true}
      />
      <SectionOptions
        active={selectedEditLayer !== undefined}
        baseOptions={
          <>
            {selectedScenarioLayer !== undefined && (
              <FeatureEditorTools projectLayer={selectedScenarioLayer} scenarioFeatures={scenarioFeatures} />
            )}
          </>
        }
      />

      {/* {SCENARIO FEATURES} */}
      <SectionHeader
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
      />
    </Box>
  );
};

export default ScenarioFeaturesEditor;
