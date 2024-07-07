import SectionHeader from "@/components/map/panels/common/SectionHeader";
import SectionOptions from "@/components/map/panels/common/SectionOptions";
import Selector from "@/components/map/panels/common/Selector";
import { getLayerIcon } from "@/components/map/panels/layer/Layer";
import { useTranslation } from "@/i18n/client";
import { useProjectLayers } from "@/lib/api/projects";
import type { Scenario } from "@/lib/validations/scenario";
import type { SelectorItem } from "@/types/map/common";
import { Box, Typography, useTheme } from "@mui/material";
import { ICON_NAME } from "@p4b/ui/components/Icon";
import { useMemo, useState } from "react";



{/* <TableRow key={v4()}>
<TableCell align="center" sx={{ px: 2 }}>
  <Typography variant="caption" fontWeight="bold">
    {point[0].toFixed(4)}
  </Typography>
</TableCell>
<TableCell align="center" sx={{ px: 2 }}>
  <Typography variant="caption" fontWeight="bold">
    {point[1].toFixed(4)}
  </Typography>
</TableCell>
<TableCell align="right" sx={{ px: 2 }}>
  <Stack
    direction="row"
    alignItems="center"
    justifyContent="end"
    spacing={1}
  >
    <Tooltip
      title={t("zoom_to_starting_point")}
      placement="top"
    >
      <IconButton
        size="small"
        onClick={() => handleZoomToStartingPoint(point)}
        sx={{
          "&:hover": {
            color: theme.palette.primary.main,
          },
        }}
      >
        <Icon
          iconName={ICON_NAME.ZOOM_IN}
          style={{ fontSize: "12px" }}
          htmlColor="inherit"
        />
      </IconButton>
    </Tooltip>
    <Tooltip
      title={t("delete_starting_point")}
      placement="top"
    >
      <IconButton
        size="small"
        sx={{
          "&:hover": {
            color: theme.palette.error.main,
          },
        }}
        onClick={() => handleDeleteStartingPoint(index)}
      >
        <Icon
          iconName={ICON_NAME.TRASH}
          style={{ fontSize: "12px" }}
          htmlColor="inherit"
        />
      </IconButton>
    </Tooltip>
  </Stack>
</TableCell>
</TableRow>
))} */}



const ScenarioFeaturesEditor = ({
  scenario,
  projectId,
}: {
  scenario: Scenario;
  projectId: string;
}) => {
  const theme = useTheme();
  const [selectedEditLayer, setSelectedEditLayer] = useState<
    SelectorItem | undefined
  >(undefined);
  const { t } = useTranslation("common");
  const { layers: projectLayers } = useProjectLayers(projectId);

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

  const scenarioFeatures = []

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography
        variant="body2"
        sx={{ fontStyle: "italic", marginBottom: theme.spacing(4) }}
      >
        GOAT allows the development of custom scenarios which can later be used
        for computing indicators to assess the impact of the interventions.
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
              setSelectedItems={(
                item: SelectorItem[] | SelectorItem | undefined,
              ) => {
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
            <p>.</p>
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
        active={true}
        baseOptions={
          <>
            <p>.</p>
          </>
        }
      />
    </Box>
  );
};

export default ScenarioFeaturesEditor;
