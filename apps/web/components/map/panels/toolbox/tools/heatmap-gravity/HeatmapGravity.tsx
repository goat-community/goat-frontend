import type { IndicatorBaseProps } from "@/types/map/toolbox";
import { useTranslation } from "@/i18n/client";

import HeatmapContainer from "@/components/map/panels/toolbox/common/HeatmapContainer";
import { useMemo, useState } from "react";
import Selector from "@/components/map/panels/common/Selector";
import type { SelectorItem } from "@/types/map/common";
import {
  heatmapGravitySchema,
  heatmapImpedanceFunctionEnum,
} from "@/lib/validations/tools";
import { ICON_NAME, Icon } from "@p4b/ui/components/Icon";
import { useLayerByGeomType, useLayerDatasetId } from "@/hooks/map/ToolsHooks";
import { useParams } from "next/navigation";
import { v4 } from "uuid";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { getTravelCostConfigValues } from "@/components/map/panels/toolbox/tools/catchment-area/utils";
import LayerFieldSelector from "@/components/map/common/LayerFieldSelector";
import type { LayerFieldType } from "@/lib/validations/layer";
import useLayerFields from "@/hooks/map/CommonHooks";
import { computeHeatmapGravity } from "@/lib/api/tools";
import { useProjectLayers } from "@/lib/api/projects";

type Opportunity = {
  layer: SelectorItem | undefined;
  maxTravelTime: SelectorItem | undefined;
  sensitivity: number | undefined;
  destinationPotentialColumn: LayerFieldType | undefined;
};

const HeatmapGravity = ({ onBack, onClose }: IndicatorBaseProps) => {
  const { t } = useTranslation("common");
  const theme = useTheme();
  const { projectId } = useParams();
  const { layers } = useProjectLayers(projectId as string);
  const defaultImpedanceFunction = {
    value: heatmapImpedanceFunctionEnum.Enum.gaussian,
    label: t(heatmapImpedanceFunctionEnum.Enum.gaussian),
  };
  const [impedanceFunction, setImpedanceFunction] = useState<
    SelectorItem | undefined
  >(defaultImpedanceFunction);

  const impedanceFunctions = useMemo(() => {
    return heatmapImpedanceFunctionEnum.options.map((value) => {
      return {
        value: value,
        label: t(value),
      } as SelectorItem;
    });
  }, [t]);

  const { filteredLayers } = useLayerByGeomType(
    ["feature"],
    ["point"],
    projectId as string,
  );

  const defaultOpportunities = [
    {
      layer: undefined,
      maxTravelTime: {
        value: 20,
        label: "20 (Min)",
      },
      sensitivity: 300000,
      destinationPotentialColumn: undefined,
    },
  ];
  const [opportunities, setOpportunities] =
    useState<Opportunity[]>(defaultOpportunities);

  const areOpportunitiesValid = useMemo(() => {
    return opportunities.every((opportunity) => {
      return (
        opportunity.layer !== undefined &&
        opportunity.maxTravelTime !== undefined &&
        opportunity.sensitivity !== undefined
      );
    });
  }, [opportunities]);

  const opportunityFilteredLayers = useMemo(() => {
    return filteredLayers.filter((layer) => {
      return !opportunities.some(
        (opportunity) => opportunity.layer?.value === layer.value,
      );
    });
  }, [filteredLayers, opportunities]);

  const [activeLayer, setActiveLayer] = useState<SelectorItem | undefined>(
    undefined,
  );
  const activeLayerDatasetId = useLayerDatasetId(
    activeLayer?.value as number | undefined,
    projectId as string,
  );
  const { layerFields: activeLayerFields } = useLayerFields(
    activeLayerDatasetId || "",
    "number",
  );

  const isValid = useMemo(() => {
    return true;
  }, []);

  const handleRun = () => {
    const payload = {
      impedance_function: impedanceFunction?.value,
      opportunities: opportunities.map((opportunity) => {
        return {
          opportunity_layer_project_id:
            layers &&
            layers.find((layer) => layer.id === opportunity.layer?.value)?.id,
          max_traveltime: opportunity.maxTravelTime?.value,
          sensitivity: opportunity.sensitivity,
        };
      }),
    };

    return {
      schema: heatmapGravitySchema,
      payload,
      apiCall: computeHeatmapGravity,
    };
  };

  const handleReset = () => {
    setImpedanceFunction(defaultImpedanceFunction);
    setOpportunities(defaultOpportunities);
    setActiveLayer(undefined);
  };

  return (
    <HeatmapContainer
      title={t("heatmap_gravity")}
      description={t("heatmap_gravity_description")}
      onBack={onBack}
      onClose={onClose}
      handleReset={handleReset}
      handleRun={handleRun}
      isValid={isValid}
      configChildren={
        <>
          <Selector
            selectedItems={impedanceFunction}
            setSelectedItems={(
              item: SelectorItem[] | SelectorItem | undefined,
            ) => {
              setImpedanceFunction(item as SelectorItem);
            }}
            items={impedanceFunctions}
            label={t("impedance_function")}
            tooltip={t("impedance_function_tooltip")}
          />
        </>
      }
      opportunitiesChildren={
        <>
          {opportunities.map((opportunity, index) => {
            return (
              <Stack spacing={2} key={opportunity.layer?.value || v4()}>
                {/* LAYER */}
                <Box>
                  {index > 0 && (
                    <Stack
                      direction="row"
                      alignItems="end"
                      justifyContent="end"
                    >
                      <IconButton
                        sx={{
                          pa: 0,
                          ma: 0,
                          "&:hover": {
                            color: theme.palette.error.main,
                          },
                        }}
                        onClick={() => {
                          setOpportunities((prev) =>
                            prev.filter((op) => op.layer !== opportunity.layer),
                          );
                        }}
                      >
                        <Icon
                          htmlColor="inherit"
                          iconName={ICON_NAME.TRASH}
                          style={{ fontSize: "12px" }}
                        />
                      </IconButton>
                    </Stack>
                  )}
                  <Selector
                    selectedItems={opportunity.layer}
                    setSelectedItems={(
                      item: SelectorItem[] | SelectorItem | undefined,
                    ) => {
                      const layer = item as SelectorItem;
                      setOpportunities((prev) =>
                        prev.map((op) =>
                          op.layer === opportunity.layer
                            ? { ...op, layer }
                            : op,
                        ),
                      );
                    }}
                    items={opportunityFilteredLayers || []}
                    emptyMessage={t("no_layers_found")}
                    emptyMessageIcon={ICON_NAME.LAYERS}
                    label={t("opportunity_layer")}
                    placeholder={t("select_opportunity_layer_placeholder")}
                    tooltip={t("select_opportunity_layer_tooltip")}
                  />
                </Box>

                {/* MAX TRAVEL TIME */}
                <Selector
                  selectedItems={opportunity.maxTravelTime}
                  setSelectedItems={(
                    item: SelectorItem[] | SelectorItem | undefined,
                  ) => {
                    const maxTravelTime = item as SelectorItem;
                    setOpportunities((prev) =>
                      prev.map((op) =>
                        op.layer === opportunity.layer
                          ? { ...op, maxTravelTime }
                          : op,
                      ),
                    );
                  }}
                  items={getTravelCostConfigValues(3, 30, "min")}
                  label={t("travel_time_limit") + " (Min)"}
                  tooltip={t("travel_time_limit_tooltip")}
                />

                {/* SENSITIVITY */}
                {/* <FormLabelHelper
                  label={t("sensitivity")}
                  tooltip={t("sensitivity_tooltip")}
                  color="inherit"
                /> */}
                {/* {FIX THIS. SHOULD READ FROM } */}
                {/* <OutlinedInput
                  value={opportunity.sensitivity}
                  size="small"
                  sx={{ pr: 0 }}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setOpportunities((prev) =>
                      prev.map((op) =>
                        op.layer === opportunity.layer
                          ? { ...op, sensitivity: value }
                          : op,
                      ),
                    );
                  }}
                  inputProps={{
                    step: 1,
                    min: 0,
                    max: 3000000,
                    type: "number",
                    style: {
                      width: "100%",
                      padding: "0px 0px 0px 10px",
                      height: "40px",
                      fontSize: "0.8rem",
                    },
                  }}
                /> */}

                {/* DESTINATION POTENTIAL COLUMN */}
                <LayerFieldSelector
                  fields={activeLayerFields}
                  onFocus={() => setActiveLayer(opportunity.layer)}
                  onClose={() => setActiveLayer(undefined)}
                  selectedField={opportunity.destinationPotentialColumn}
                  disabled={!opportunity.layer}
                  setSelectedField={(field) => {
                    setOpportunities((prev) =>
                      prev.map((op) =>
                        op.layer === opportunity.layer
                          ? { ...op, destinationPotentialColumn: field }
                          : op,
                      ),
                    );
                  }}
                  label={t("destination_potential_column")}
                  tooltip={t("destination_potential_column_tooltip")}
                />

                {index === 0 && opportunities.length > 1 && <Divider />}
              </Stack>
            );
          })}
          <Divider />
          <Button
            fullWidth
            disabled={
              !areOpportunitiesValid ||
              !opportunityFilteredLayers.length ||
              opportunities.length >= 5
            }
            onClick={() => {
              setOpportunities((prev) => [...prev, defaultOpportunities[0]]);
            }}
            variant="text"
            size="small"
            startIcon={
              <Icon iconName={ICON_NAME.PLUS} style={{ fontSize: "15px" }} />
            }
          >
            <Typography variant="body2" color="inherit">
              {t("common:add_opportunity")}
            </Typography>
          </Button>
        </>
      }
    />
  );
};

export default HeatmapGravity;
