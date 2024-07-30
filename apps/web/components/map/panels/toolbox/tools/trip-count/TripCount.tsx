import { Box, Typography, useTheme } from "@mui/material";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";

import { ICON_NAME } from "@p4b/ui/components/Icon";

import { useTranslation } from "@/i18n/client";

import { useJobs } from "@/lib/api/jobs";
import { computeTripCount } from "@/lib/api/tools";
import { accessibilityIndicatorsStaticPayload } from "@/lib/constants/payloads";
import { setRunningJobIds } from "@/lib/store/jobs/slice";
import { jobTypeEnum } from "@/lib/validations/jobs";
import { tripCountSchema } from "@/lib/validations/tools";

import type { SelectorItem } from "@/types/map/common";
import type { IndicatorBaseProps } from "@/types/map/toolbox";

import { useLayerByGeomType, usePTTimeSelectorValues, useScenarioItems } from "@/hooks/map/ToolsHooks";
import { useAppDispatch, useAppSelector } from "@/hooks/store/ContextHooks";

import Container from "@/components/map/panels/Container";
import SectionHeader from "@/components/map/panels/common/SectionHeader";
import SectionOptions from "@/components/map/panels/common/SectionOptions";
import Selector from "@/components/map/panels/common/Selector";
import ToolboxActionButtons from "@/components/map/panels/common/ToolboxActionButtons";
import ToolsHeader from "@/components/map/panels/common/ToolsHeader";
import PTTimeSelectors from "@/components/map/panels/toolbox/common/PTTimeSelectors";

const TripCount = ({ onBack, onClose }: IndicatorBaseProps) => {
  const { t } = useTranslation("common");
  const theme = useTheme();
  const [isBusy, setIsBusy] = useState(false);
  const { mutate } = useJobs({
    read: false,
  });
  const dispatch = useAppDispatch();
  const runningJobIds = useAppSelector((state) => state.jobs.runningJobIds);
  const { projectId } = useParams();
  const { filteredLayers } = useLayerByGeomType(["feature"], ["polygon"], projectId as string);
  const [referenceLayer, setReferenceLayer] = useState<SelectorItem | undefined>(undefined);

  const {
    // ptModes,
    ptDays,
    ptStartTime,
    setPTStartTime,
    ptEndTime,
    setPTEndTime,
    ptDay,
    setPTDay,
    isPTValid,
    resetPTConfiguration,
  } = usePTTimeSelectorValues();

  // Scenario
  const { scenarioItems } = useScenarioItems(projectId as string);
  const [selectedScenario, setSelectedScenario] = useState<SelectorItem | undefined>(undefined);

  const isValid = useMemo(() => {
    if (!referenceLayer || !isPTValid) {
      return false;
    }
    return true;
  }, [isPTValid, referenceLayer]);

  const handleRun = async () => {
    const payload = {
      time_window: {
        weekday: ptDay?.value,
        from_time: ptStartTime,
        to_time: ptEndTime,
      },
      reference_area_layer_project_id: referenceLayer?.value,
      station_config: accessibilityIndicatorsStaticPayload,
    };
    if (selectedScenario) {
      payload["scenario_id"] = selectedScenario?.value;
    }
    try {
      setIsBusy(true);
      const parsedPayload = tripCountSchema.parse(payload);
      const response = await computeTripCount(parsedPayload, projectId as string);
      const { job_id } = response;
      if (job_id) {
        toast.info(`"${t(jobTypeEnum.Enum.trip_count_station)}" - ${t("job_started")}`);
        mutate();
        dispatch(setRunningJobIds([...runningJobIds, job_id]));
      }
    } catch (error) {
      toast.error(`"${t(jobTypeEnum.Enum.trip_count_station)}" - ${t("job_failed")}`);
    } finally {
      setIsBusy(false);
      handleReset();
    }
  };

  const handleReset = () => {
    setReferenceLayer(undefined);
    setSelectedScenario(undefined);
    resetPTConfiguration();
  };

  return (
    <>
      <Container
        disablePadding={false}
        header={<ToolsHeader onBack={onBack} title={t("trip_count_header")} />}
        close={onClose}
        body={
          <>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}>
              {/* DESCRIPTION */}
              <Typography variant="body2" sx={{ fontStyle: "italic", marginBottom: theme.spacing(4) }}>
                {t("trip_count_description")}
              </Typography>

              {/* CALCULATION TIME */}
              <SectionHeader
                active={true}
                alwaysActive={true}
                label={t("calculation_time")}
                icon={ICON_NAME.CLOCK}
                disableAdvanceOptions={true}
              />
              <SectionOptions
                active={true}
                baseOptions={
                  <>
                    <PTTimeSelectors
                      ptStartTime={ptStartTime}
                      setPTStartTime={setPTStartTime}
                      ptEndTime={ptEndTime}
                      setPTEndTime={setPTEndTime}
                      ptDays={ptDays}
                      ptDay={ptDay}
                      setPTDay={setPTDay}
                      isPTValid={isPTValid}
                    />
                  </>
                }
              />

              {/* REFERENCE LAYER */}
              <SectionHeader
                active={true}
                alwaysActive={true}
                label={t("reference_layer")}
                icon={ICON_NAME.LAYERS}
                disableAdvanceOptions={true}
              />
              <SectionOptions
                active={true}
                baseOptions={
                  <>
                    <Selector
                      selectedItems={referenceLayer}
                      setSelectedItems={(item: SelectorItem[] | SelectorItem | undefined) => {
                        setReferenceLayer(item as SelectorItem);
                      }}
                      items={filteredLayers}
                      emptyMessage={t("no_polygon_layer_found")}
                      emptyMessageIcon={ICON_NAME.LAYERS}
                      label={t("select_reference_layer")}
                      placeholder={t("select_reference_layer_placeholder")}
                      tooltip={t("select_reference_layer_tooltip")}
                    />
                  </>
                }
              />

              {/* SCENARIO */}
              <SectionHeader
                active={isValid}
                alwaysActive={true}
                label={t("scenario")}
                icon={ICON_NAME.SCENARIO}
                disableAdvanceOptions={true}
              />
              <SectionOptions
                active={isValid}
                baseOptions={
                  <>
                    <Selector
                      selectedItems={selectedScenario}
                      setSelectedItems={(item: SelectorItem[] | SelectorItem | undefined) => {
                        setSelectedScenario(item as SelectorItem);
                      }}
                      items={scenarioItems}
                      label={t("scenario")}
                      placeholder={t("select_scenario")}
                      tooltip={t("choose_scenario")}
                    />
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
      ;
    </>
  );
};

export default TripCount;
