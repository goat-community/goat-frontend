import FormLabelHelper from "@/components/common/FormLabelHelper";
import Container from "@/components/map/panels/Container";
import SectionHeader from "@/components/map/panels/common/SectionHeader";
import SectionOptions from "@/components/map/panels/common/SectionOptions";
import Selector from "@/components/map/panels/common/Selector";
import SliderInput from "@/components/map/panels/common/SliderInput";
import ToolboxActionButtons from "@/components/map/panels/common/ToolboxActionButtons";
import ToolsHeader from "@/components/map/panels/common/ToolsHeader";
import { getTravelCostConfigValues } from "@/components/map/panels/toolbox/tools/catchment-area/utils";
import { useLayerByGeomType } from "@/hooks/map/ToolsHooks";
import { useAppDispatch, useAppSelector } from "@/hooks/store/ContextHooks";
import { useTranslation } from "@/i18n/client";
import { useJobs } from "@/lib/api/jobs";
import { computeBuffer } from "@/lib/api/tools";
import { setRunningJobIds } from "@/lib/store/jobs/slice";
import { bufferDefaults, bufferSchema } from "@/lib/validations/tools";
import type { SelectorItem } from "@/types/map/common";
import type { IndicatorBaseProps } from "@/types/map/toolbox";
import { Box, Stack, Switch, Typography, useTheme } from "@mui/material";
import { ICON_NAME } from "@p4b/ui/components/Icon";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const Buffer = ({ onBack, onClose }: IndicatorBaseProps) => {
  const { projectId } = useParams();
  const theme = useTheme();
  const { t } = useTranslation("common");
  const [isBusy, setIsBusy] = useState(false);
  const { mutate } = useJobs({
    read: false,
  });
  const dispatch = useAppDispatch();
  const runningJobIds = useAppSelector((state) => state.jobs.runningJobIds);
  const isValid = useMemo(() => {
    return true;
  }, []);
  const [bufferLayer, setBufferLayer] = useState<SelectorItem | undefined>(
    undefined,
  );
  const [distance, setDistance] = useState<number>(
    bufferDefaults.default_distance,
  );
  const [steps, setSteps] = useState<SelectorItem | undefined>({
    value: bufferDefaults.default_steps,
    label: bufferDefaults.default_steps.toString(),
  });

  const [isPolygonUnion, setIsPolygonUnion] = useState<boolean>(true);
  const [isPolygonDifference, setIsPolygonDifference] =
    useState<boolean>(false);

  useEffect(() => {
    if (!isPolygonUnion) {
      setIsPolygonDifference(false);
    }
  }, [isPolygonUnion]);

  const { filteredLayers } = useLayerByGeomType(
    ["feature"],
    undefined,
    projectId as string,
  );

  const handleRun = async () => {
    const payload = {
      source_layer_project_id: bufferLayer?.value,
      max_distance: distance,
      distance_step: steps?.value,
      polygon_union: isPolygonUnion,
      polygon_difference: isPolygonDifference,
    };
    try {
      setIsBusy(true);
      const parsedPayload = bufferSchema.parse(payload);
      const response = await computeBuffer(parsedPayload, projectId as string);
      const { job_id } = response;
      if (job_id) {
        toast.info(t("buffer_computation_started"));
        mutate();
        dispatch(setRunningJobIds([...runningJobIds, job_id]));
      }
    } catch (error) {
      toast.error(t("error_running_buffer_computation"));
    } finally {
      setIsBusy(false);
      handleReset();
    }
  };
  const handleReset = () => {
    setBufferLayer(undefined);
    setDistance(bufferDefaults.default_distance);
    setIsPolygonUnion(true);
    setIsPolygonDifference(false);
    setSteps({
      value: bufferDefaults.default_steps,
      label: bufferDefaults.default_steps.toString(),
    });
  };
  return (
    <Container
      disablePadding={false}
      header={<ToolsHeader onBack={onBack} title={t("buffer_header")} />}
      close={onClose}
      body={
        <>
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
              {t("buffer_description")}
            </Typography>
            <SectionHeader
              active={true}
              alwaysActive={true}
              label={t("pick_layer_to_buffer")}
              icon={ICON_NAME.LAYERS}
              disableAdvanceOptions={true}
            />
            <SectionOptions
              active={true}
              baseOptions={
                <>
                  <Selector
                    selectedItems={bufferLayer}
                    setSelectedItems={(
                      item: SelectorItem[] | SelectorItem | undefined,
                    ) => {
                      setBufferLayer(item as SelectorItem);
                    }}
                    items={filteredLayers}
                    emptyMessage={t("no_layers_found")}
                    emptyMessageIcon={ICON_NAME.LAYERS}
                    label={t("select_buffer_layer")}
                    placeholder={t("select_buffer_layer_placeholder")}
                    tooltip={t("select_buffer_layer_tooltip")}
                  />
                </>
              }
            />
            <SectionHeader
              active={!!bufferLayer}
              alwaysActive={true}
              label={t("buffer_settings")}
              icon={ICON_NAME.SETTINGS}
              disableAdvanceOptions={true}
            />
            <SectionOptions
              active={!!bufferLayer}
              baseOptions={
                <>
                  <Stack>
                    <FormLabelHelper
                      label={`${t("buffer_distance")} (Meter)`}
                      color="inherit"
                    />
                    <SliderInput
                      value={distance}
                      min={bufferDefaults.min_distance}
                      max={bufferDefaults.max_distance}
                      onChange={(value) => setDistance(value as number)}
                      isRange={false}
                      step={bufferDefaults.buffer_step}
                      rootSx={{
                        pl: 3,
                        pr: 2,
                      }}
                    />
                  </Stack>
                  <Selector
                    selectedItems={steps}
                    setSelectedItems={(
                      item: SelectorItem[] | SelectorItem | undefined,
                    ) => {
                      setSteps(item as SelectorItem);
                    }}
                    items={getTravelCostConfigValues(1, 9)}
                    label={t("buffer_steps") + " (Steps)"}
                    tooltip={t("buffer_steps_tooltip")}
                  />
                  <Stack>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <FormLabelHelper
                        label={t("polygon_union")}
                        color="inherit"
                      />
                      <Switch
                        size="small"
                        checked={isPolygonUnion}
                        onChange={() => setIsPolygonUnion(!isPolygonUnion)}
                      />
                    </Stack>
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
                        size="small"
                        disabled={!isPolygonUnion}
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

export default Buffer;
