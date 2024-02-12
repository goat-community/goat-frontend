import React, { useCallback, useEffect, useMemo, useState } from "react";
import ToolboxActionButtons from "@/components/map/panels/common/ToolboxActionButtons";
import Container from "@/components/map/panels/Container";
import ToolsHeader from "@/components/map/panels/toolbox/common/ToolsHeader";
import { useTranslation } from "@/i18n/client";
import { useProjectLayers } from "@/lib/api/projects";
import { useParams } from "next/navigation";
import type { CatchmentAreaRoutingType } from "@/lib/validations/tools";
import {
  CatchmentAreaRoutingTypeEnum,
  PTAccessModes,
  PTEgressModes,
  PTRoutingModes,
  activeMobilityAndCarCatchmentAreaSchema,
  catchmentAreaConfigDefaults,
  catchmentAreaMaskLayerNames,
  catchmentAreaShapeEnum,
  ptCatchmentAreaSchema,
} from "@/lib/validations/tools";
import { ICON_NAME } from "@p4b/ui/components/Icon";
import type { SelectorItem } from "@/types/map/common";
import {
  Box,
  Divider,
  Stack,
  Switch,
  Typography,
  useTheme,
} from "@mui/material";
import SectionHeader from "@/components/map/panels/common/SectionHeader";
import SectionOptions from "@/components/map/panels/common/SectionOptions";
import Selector from "@/components/map/panels/common/Selector";
import CatchmentAreaTypeTab from "@/components/map/panels/toolbox/tools/catchment-area/CatchmentAreaTabs";
import FormLabelHelper from "@/components/common/FormLabelHelper";
import CatchmentAreaTimeSelectors from "@/components/map/panels/toolbox/tools/catchment-area/CatchmentAreaTimeSelectors";
import CatchmentAreaDistanceSelectors from "@/components/map/panels/toolbox/tools/catchment-area/CatchmentAreaDistanceSelectors";
import { getDefaultConfigValue } from "@/components/map/panels/toolbox/tools/catchment-area/utils";
import {
  computeActiveMobilityCatchmentArea,
  computePTCatchmentArea,
} from "@/lib/api/catchmentArea";
import { toast } from "react-toastify";
import { useJobs } from "@/lib/api/jobs";
import { useAppDispatch, useAppSelector } from "@/hooks/store/ContextHooks";
import { setRunningJobIds } from "@/lib/store/jobs/slice";
import CatchmentAreaStartingPoints from "@/components/map/panels/toolbox/tools/catchment-area/CatchmentAreaStartingPoints";
import { setMaskLayer, setToolboxStartingPoints } from "@/lib/store/map/slice";

interface IndicatorBaseProps {
  onBack: () => void;
  onClose: () => void;
}

const CatchmentArea = ({ onBack, onClose }: IndicatorBaseProps) => {
  const { t } = useTranslation("maps");
  const theme = useTheme();
  const { projectId } = useParams();
  const startingPoints = useAppSelector(
    (state) => state.map.toolboxStartingPoints,
  );
  const { layers } = useProjectLayers(projectId as string);
  const { mutate } = useJobs({
    read: false,
  });
  const dispatch = useAppDispatch();
  const runningJobIds = useAppSelector((state) => state.jobs.runningJobIds);
  const [isBusy, setIsBusy] = useState(false);

  const routingTypes: SelectorItem[] = useMemo(() => {
    return [
      {
        value: CatchmentAreaRoutingTypeEnum.Enum.walking,
        label: t("panels.isochrone.routing.modes.walk"),
        icon: ICON_NAME.RUN,
      },
      {
        value: CatchmentAreaRoutingTypeEnum.Enum.bicycle,
        label: t("panels.isochrone.routing.modes.bicycle"),
        icon: ICON_NAME.BICYCLE,
      },
      {
        value: CatchmentAreaRoutingTypeEnum.Enum.pedelec,
        label: t("panels.isochrone.routing.modes.pedelec"),
        icon: ICON_NAME.PEDELEC,
      },
      {
        value: CatchmentAreaRoutingTypeEnum.Enum.car_peak,
        label: t("panels.isochrone.routing.modes.car"),
        icon: ICON_NAME.CAR,
      },
      {
        value: CatchmentAreaRoutingTypeEnum.Enum.pt,
        label: t("panels.isochrone.routing.modes.pt"),
        icon: ICON_NAME.BUS,
      },
    ];
  }, [t]);

  const ptModes: SelectorItem[] = useMemo(() => {
    return [
      {
        value: PTRoutingModes.Enum.bus,
        label: t("panels.isochrone.routing.modes.bus"),
        icon: ICON_NAME.BUS,
      },
      {
        value: PTRoutingModes.Enum.tram,
        label: t("panels.isochrone.routing.modes.tram"),
        icon: ICON_NAME.TRAM,
      },
      {
        value: PTRoutingModes.Enum.rail,
        label: t("panels.isochrone.routing.modes.rail"),
        icon: ICON_NAME.RAIL,
      },
      {
        value: PTRoutingModes.Enum.subway,
        label: t("panels.isochrone.routing.modes.subway"),
        icon: ICON_NAME.SUBWAY,
      },
      {
        value: PTRoutingModes.Enum.ferry,
        label: t("panels.isochrone.routing.modes.ferry"),
        icon: ICON_NAME.FERRY,
      },
      {
        value: PTRoutingModes.Enum.cable_car,
        label: t("panels.isochrone.routing.modes.cable_car"),
        icon: ICON_NAME.CABLE_CAR,
      },
      {
        value: PTRoutingModes.Enum.gondola,
        label: t("panels.isochrone.routing.modes.gondola"),
        icon: ICON_NAME.GONDOLA,
      },
      {
        value: PTRoutingModes.Enum.funicular,
        label: t("panels.isochrone.routing.modes.funicular"),
        icon: ICON_NAME.FUNICULAR,
      },
    ];
  }, [t]);

  const catchmentAreaShapeTypes: SelectorItem[] = useMemo(() => {
    return [
      {
        value: catchmentAreaShapeEnum.Enum.polygon,
        label: t("polygon"),
      },
      {
        value: catchmentAreaShapeEnum.Enum.network,
        label: t("network"),
      },
      {
        value: catchmentAreaShapeEnum.Enum.rectangular_grid,
        label: t("rectangular_grid"),
      },
    ];
  }, [t]);

  const startingPointMethods: SelectorItem[] = useMemo(() => {
    return [
      {
        value: "map",
        label: t("select_on_map"),
      },
      {
        value: "browser_layer",
        label: t("select_from_point_layer"),
      },
    ];
  }, [t]);

  const pointLayers: SelectorItem[] = useMemo(() => {
    if (!layers) return [];
    return layers
      .filter((layer) => layer.feature_layer_geometry_type === "point")
      .map((layer) => {
        return {
          value: layer.id,
          label: layer.name,
          icon: ICON_NAME.LAYERS,
        };
      });
  }, [layers]);

  // Routing
  const [selectedRouting, setSelectedRouting] = useState<
    SelectorItem | undefined
  >(undefined);
  const [selectedPTModes, setSelectedPTModes] = useState<
    SelectorItem[] | undefined
  >(ptModes);

  const isRoutingValid = useMemo(() => {
    if (
      !selectedRouting ||
      (selectedRouting.value === CatchmentAreaRoutingTypeEnum.Enum.pt &&
        selectedPTModes?.length === 0)
    )
      return false;
    return true;
  }, [selectedPTModes?.length, selectedRouting]);

  const [catchmentAreaType, setCatchmentAreaType] = useState<
    "time" | "distance"
  >("time");

  // Configuration
  const [advanceConfig, setAdvanceConfig] = useState(true);

  const handleCachmentAreaTypeChange = (
    _event: React.SyntheticEvent,
    newValue: "time" | "distance",
  ) => {
    setCatchmentAreaType(newValue);
  };

  // Active catchment area configuration
  const [maxTravelTime, setMaxTravelTime] = useState<SelectorItem | undefined>(
    undefined,
  );
  const [speed, setSpeed] = useState<SelectorItem | undefined>(undefined);
  const [distance, setDistance] = useState<number | undefined>(undefined);
  const [steps, setSteps] = useState<SelectorItem | undefined>(undefined);

  const [ptStartTime, setPTStartTime] = useState<number | undefined>(undefined);
  const [ptEndTime, setPTEndTime] = useState<number | undefined>(undefined);
  const isPTValid = useMemo(() => {
    if (!ptStartTime || !ptEndTime || ptStartTime >= ptEndTime) {
      return false;
    }
    return true;
  }, [ptStartTime, ptEndTime]);

  const areStepsValid = useMemo(() => {
    if (steps && maxTravelTime && maxTravelTime.value >= steps.value) {
      return true;
    }
    return false;
  }, [maxTravelTime, steps]);

  // Advanced settings
  const [catchmentAreaShapeType, setCatchmentAreaShapeType] =
    useState<SelectorItem>(catchmentAreaShapeTypes[0]);

  const [isPolygonDifference, setIsPolygonDifference] = useState(false);
  useEffect(() => {
    // Only show polygon difference for polygon shape
    if (catchmentAreaShapeType.value !== catchmentAreaShapeEnum.Enum.polygon) {
      setIsPolygonDifference(false);
    } else {
      setIsPolygonDifference(true);
    }
  }, [catchmentAreaShapeType]);

  // Reset values
  const handleConfigurationReset = useCallback(() => {
    setCatchmentAreaType("time");
    setAdvanceConfig(true);
    setMaxTravelTime(
      getDefaultConfigValue(
        (selectedRouting?.value as CatchmentAreaRoutingType) || "walking",
        "max_travel_time",
      ),
    );
    if (selectedRouting?.value !== CatchmentAreaRoutingTypeEnum.Enum.pt) {
      setSpeed(
        getDefaultConfigValue(
          (selectedRouting?.value as CatchmentAreaRoutingType) || "walking",
          "speed",
        ),
      );
    }
    const distance = getDefaultConfigValue(
      (selectedRouting?.value as CatchmentAreaRoutingType) || "walking",
      "max_distance",
    );
    setDistance(distance.value);
    const steps = getDefaultConfigValue(
      (selectedRouting?.value as CatchmentAreaRoutingType) || "walking",
      "steps",
    );
    setSteps(steps);
    setCatchmentAreaShapeType(catchmentAreaShapeTypes[0]);
    setPTStartTime(catchmentAreaConfigDefaults.pt.start_time);
    setPTEndTime(catchmentAreaConfigDefaults.pt.end_time);

    // Reset starting method
    setStartingPointMethod(startingPointMethods[0]);
    setStartingPointLayer(undefined);
  }, [catchmentAreaShapeTypes, selectedRouting?.value, startingPointMethods]);

  useEffect(() => {
    handleConfigurationReset();
  }, [handleConfigurationReset, selectedRouting]);

  // Starting point

  const [startingPointMethod, setStartingPointMethod] = useState<SelectorItem>(
    startingPointMethods[0],
  );

  const [startingPointLayer, setStartingPointLayer] = useState<
    SelectorItem | undefined
  >(undefined);

  const isValid = useMemo(() => {
    if (!isRoutingValid || (!areStepsValid && catchmentAreaType === "time"))
      return false;
    if (
      selectedRouting?.value === CatchmentAreaRoutingTypeEnum.Enum.pt &&
      !isPTValid
    )
      return false;
    if (
      startingPointMethod.value === "browser_layer" &&
      !startingPointLayer?.value
    )
      return false;

    if (
      startingPointMethod.value === "map" &&
      (!startingPoints || startingPoints.length === 0)
    )
      return false;

    return true;
  }, [
    areStepsValid,
    catchmentAreaType,
    isPTValid,
    isRoutingValid,
    selectedRouting?.value,
    startingPointLayer?.value,
    startingPointMethod.value,
    startingPoints,
  ]);

  const handleReset = () => {
    dispatch(setMaskLayer(undefined));
    dispatch(setToolboxStartingPoints(undefined));
    setSelectedRouting(undefined);
    handleConfigurationReset();
  };

  const handleRun = async () => {
    const payload = {
      isochrone_type: catchmentAreaShapeType.value,
      polygon_difference: isPolygonDifference,
    };
    if (startingPointMethod.value === "map") {
      const longitude = startingPoints?.map((point) => point[0]);
      const latitude = startingPoints?.map((point) => point[1]);
      payload["starting_points"] = {
        longitude,
        latitude,
      };
    }
    if (startingPointMethod.value === "browser_layer") {
      payload["starting_points"] = {
        layer_project_id: startingPointLayer?.value,
      };
    }

    if (selectedRouting?.value === CatchmentAreaRoutingTypeEnum.Enum.pt) {
      payload["routing_type"] = {
        mode: selectedPTModes?.map((mode) => mode.value),
        egress_mode: PTEgressModes.Enum.walk,
        access_mode: PTAccessModes.Enum.walk,
      };
      payload["travel_cost"] = {
        max_traveltime: maxTravelTime?.value,
        traveltime_step: steps?.value,
      };
      payload["time_window"] = {
        from_time: ptStartTime,
        to_time: ptEndTime,
        weekday: "weekday",
      };
      try {
        setIsBusy(true);
        const parsedPayload = ptCatchmentAreaSchema.parse(payload);
        const response = await computePTCatchmentArea(
          parsedPayload,
          projectId as string,
        );
        const { job_id } = response;
        if (job_id) {
          toast.info(t("catchment_area_computation_started"));
          mutate();
          dispatch(setRunningJobIds([...runningJobIds, job_id]));
        }
      } catch {
        toast.error(t("failed_to_compute_catchment_area"));
      } finally {
        setIsBusy(false);
        handleReset();
        return;
      }
    }
    const travelTimeCost = {
      max_traveltime: maxTravelTime?.value,
      traveltime_step: steps?.value,
      speed: speed?.value,
    };
    const distanceCost = {
      max_distance: distance,
      distance_step: steps?.value,
    };
    payload["travel_cost"] =
      catchmentAreaType === "time" ? travelTimeCost : distanceCost;
    payload["routing_type"] = selectedRouting?.value;

    if (selectedRouting?.value !== CatchmentAreaRoutingTypeEnum.Enum.car_peak) {
      console.log("computeActiveMobilityCatchmentArea");
      try {
        setIsBusy(true);
        const parsedPayload =
          activeMobilityAndCarCatchmentAreaSchema.parse(payload);
        const response = await computeActiveMobilityCatchmentArea(
          parsedPayload,
          projectId as string,
        );
        const { job_id } = response;
        if (job_id) {
          toast.info(t("catchment_area_computation_started"));
          mutate();
          dispatch(setRunningJobIds([...runningJobIds, job_id]));
        }
      } catch {
        toast.error(t("failed_to_compute_catchment_area"));
      } finally {
        setIsBusy(false);
        handleReset();
        return;
      }
    }

    if (selectedRouting?.value === CatchmentAreaRoutingTypeEnum.Enum.car_peak) {
      try {
        setIsBusy(true);
        const parsedPayload =
          activeMobilityAndCarCatchmentAreaSchema.parse(payload);
        const response = await computeActiveMobilityCatchmentArea(
          parsedPayload,
          projectId as string,
        );
        const { job_id } = response;
        if (job_id) {
          toast.info(t("catchment_area_computation_started"));
          mutate();
          dispatch(setRunningJobIds([...runningJobIds, job_id]));
        }
      } catch {
        toast.error(t("failed_to_compute_catchment_area"));
      } finally {
        setIsBusy(false);
        handleReset();
        return;
      }
    }
  };
  return (
    <Container
      disablePadding={false}
      header={
        <ToolsHeader onBack={onBack} title={t("panels.isochrone.isochrone")} />
      }
      close={onClose}
      body={
        <>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* DESCRIPTION */}
            <Typography
              variant="body2"
              sx={{ fontStyle: "italic", marginBottom: theme.spacing(4) }}
            >
              {t("panels.isochrone.isochrone_description")}
            </Typography>

            {/* ROUTING */}
            <SectionHeader
              active={true}
              alwaysActive={true}
              label={t("panels.isochrone.routing.routing")}
              icon={ICON_NAME.ROUTE}
              disableAdvanceOptions={true}
            />
            <SectionOptions
              active={true}
              collapsed={
                selectedRouting?.value !== CatchmentAreaRoutingTypeEnum.Enum.pt
              }
              baseOptions={
                <>
                  <Selector
                    selectedItems={selectedRouting}
                    setSelectedItems={(
                      item: SelectorItem[] | SelectorItem | undefined,
                    ) => {
                      const routing = item as SelectorItem;
                      setSelectedRouting(routing);
                      if (
                        routing.value === CatchmentAreaRoutingTypeEnum.Enum.pt
                      ) {
                        dispatch(setMaskLayer(catchmentAreaMaskLayerNames.pt));
                      }
                      if (
                        routing.value !== CatchmentAreaRoutingTypeEnum.Enum.pt
                      ) {
                        // same mask layer for active mobility and car.
                        // it can be changed in the future
                        dispatch(
                          setMaskLayer(
                            catchmentAreaMaskLayerNames.active_mobility,
                          ),
                        );
                      }
                    }}
                    items={routingTypes}
                    label={t("routing_type")}
                    placeholder={t("select_routing")}
                    tooltip={t("choose_routing")}
                  />
                </>
              }
              advancedOptions={
                <>
                  <Selector
                    selectedItems={selectedPTModes}
                    setSelectedItems={(
                      item: SelectorItem[] | SelectorItem | undefined,
                    ) => {
                      setSelectedPTModes(item as SelectorItem[]);
                    }}
                    items={ptModes}
                    multiple
                    label={t("routing_pt_mode")}
                    placeholder={t("select_pt_mode")}
                    tooltip={t("choose_pt_mode")}
                    allSelectedLabel={t("all")}
                  />
                </>
              }
            />
            {/* CONFIGURATION */}
            <SectionHeader
              active={isRoutingValid}
              alwaysActive={true}
              label={t("panels.isochrone.configuration")}
              icon={ICON_NAME.SETTINGS}
              disableAdvanceOptions={false}
              setCollapsed={setAdvanceConfig}
              collapsed={advanceConfig}
            />
            <SectionOptions
              active={isRoutingValid}
              collapsed={advanceConfig}
              baseOptions={
                <>
                  {selectedRouting?.value !==
                    CatchmentAreaRoutingTypeEnum.Enum.pt && (
                    <CatchmentAreaTypeTab
                      catchmentAreaType={catchmentAreaType}
                      handleCachmentAreaTypeChange={
                        handleCachmentAreaTypeChange
                      }
                      tabPanels={[
                        {
                          value: "time",
                          children: (
                            <>
                              <CatchmentAreaTimeSelectors
                                routingType={
                                  selectedRouting?.value as CatchmentAreaRoutingType
                                }
                                maxTravelTime={maxTravelTime}
                                setMaxTravelTime={setMaxTravelTime}
                                speed={speed}
                                setSpeed={setSpeed}
                                steps={steps}
                                setSteps={setSteps}
                                ptStartTime={ptStartTime}
                                setPTStartTime={setPTStartTime}
                                ptEndTime={ptEndTime}
                                setPTEndTime={setPTEndTime}
                                areStepsValid={areStepsValid}
                                isPTValid={isPTValid}
                                t={t}
                              />
                            </>
                          ),
                        },
                        {
                          value: "distance",
                          children: (
                            <>
                              <CatchmentAreaDistanceSelectors
                                distance={distance}
                                setDistance={setDistance}
                                steps={steps}
                                setSteps={setSteps}
                                t={t}
                              />
                            </>
                          ),
                        },
                      ]}
                    />
                  )}
                  {selectedRouting?.value ===
                    CatchmentAreaRoutingTypeEnum.Enum.pt && (
                    <CatchmentAreaTimeSelectors
                      routingType={
                        selectedRouting?.value as CatchmentAreaRoutingType
                      }
                      maxTravelTime={maxTravelTime}
                      setMaxTravelTime={setMaxTravelTime}
                      speed={speed}
                      setSpeed={setSpeed}
                      steps={steps}
                      setSteps={setSteps}
                      ptStartTime={ptStartTime}
                      setPTStartTime={setPTStartTime}
                      ptEndTime={ptEndTime}
                      setPTEndTime={setPTEndTime}
                      areStepsValid={areStepsValid}
                      isPTValid={isPTValid}
                      t={t}
                    />
                  )}
                </>
              }
              advancedOptions={
                <>
                  <Divider />
                  <Stack spacing={4}>
                    <Selector
                      selectedItems={catchmentAreaShapeType}
                      setSelectedItems={(
                        item: SelectorItem[] | SelectorItem | undefined,
                      ) => {
                        setCatchmentAreaShapeType(item as SelectorItem);
                      }}
                      items={catchmentAreaShapeTypes}
                      label={t("catchment_area_shape")}
                      placeholder={t("select_catchment_area_shape")}
                      tooltip={t("catchment_area_shape_tooltip")}
                    />
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <FormLabelHelper
                        label={t("polygon_difference")}
                        color="inherit"
                      />
                      <Switch
                        disabled={catchmentAreaShapeType.value !== "polygon"}
                        size="small"
                        checked={isPolygonDifference}
                        onChange={() =>
                          setIsPolygonDifference(!isPolygonDifference)
                        }
                      />
                    </Stack>
                  </Stack>
                </>
              }
            />

            {/* STARTING */}
            <SectionHeader
              active={isRoutingValid}
              alwaysActive={true}
              label={t("panels.isochrone.starting.starting")}
              icon={ICON_NAME.LOCATION}
              disableAdvanceOptions={true}
            />

            <SectionOptions
              active={isRoutingValid}
              baseOptions={
                <>
                  <Selector
                    selectedItems={startingPointMethod}
                    setSelectedItems={(
                      item: SelectorItem[] | SelectorItem | undefined,
                    ) => {
                      dispatch(setToolboxStartingPoints(undefined));
                      setStartingPointLayer(undefined);
                      setStartingPointMethod(item as SelectorItem);
                    }}
                    items={startingPointMethods}
                    label={t("select_starting_point_method")}
                    placeholder={t("select_starting_point_method_placeholder")}
                    tooltip={t("select_starting_point_method_tooltip")}
                  />

                  {startingPointMethod.value === "browser_layer" && (
                    <Selector
                      selectedItems={startingPointLayer}
                      setSelectedItems={(
                        item: SelectorItem[] | SelectorItem | undefined,
                      ) => {
                        setStartingPointLayer(item as SelectorItem);
                      }}
                      items={pointLayers}
                      emptyMessage={t("no_point_layer_found")}
                      emptyMessageIcon={ICON_NAME.LAYERS}
                      label={t("select_point_layer")}
                      placeholder={t("select_point_layer_placeholder")}
                      tooltip={t("select_point_layer_tooltip")}
                    />
                  )}

                  {startingPointMethod.value === "map" &&
                    selectedRouting?.value && <CatchmentAreaStartingPoints />}
                </>
              }
            />
          </Box>
        </>
      }
      action={
        <ToolboxActionButtons
          runFunction={handleRun}
          runDisabled={!isValid}
          isBusy={isBusy}
          resetFunction={handleReset}
        />
      }
    />
  );
};

export default CatchmentArea;
