import LayerFieldSelector from "@/components/map/common/LayerFieldSelector";
import Container from "@/components/map/panels/Container";
import SectionHeader from "@/components/map/panels/common/SectionHeader";
import SectionOptions from "@/components/map/panels/common/SectionOptions";
import Selector from "@/components/map/panels/common/Selector";
import ToolboxActionButtons from "@/components/map/panels/common/ToolboxActionButtons";
import ToolsHeader from "@/components/map/panels/toolbox/common/ToolsHeader";
import useLayerFields from "@/hooks/map/CommonHooks";
import {
  useLayerByGeomType,
  useLayerDatasetId,
  useStatisticValues,
} from "@/hooks/map/ToolsHooks";
import { useAppDispatch, useAppSelector } from "@/hooks/store/ContextHooks";
import { useTranslation } from "@/i18n/client";
import { useJobs } from "@/lib/api/jobs";
import { computeJoin } from "@/lib/api/tools";
import { setRunningJobIds } from "@/lib/store/jobs/slice";
import type { LayerFieldType } from "@/lib/validations/layer";
import { joinSchema, statisticOperationEnum } from "@/lib/validations/tools";
import type { SelectorItem } from "@/types/map/common";
import type { IndicatorBaseProps } from "@/types/map/toolbox";
import { Box, Typography, useTheme } from "@mui/material";
import { ICON_NAME } from "@p4b/ui/components/Icon";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const Join = ({ onBack, onClose }: IndicatorBaseProps) => {
  const { projectId } = useParams();
  const theme = useTheme();
  const { t } = useTranslation("maps");
  const [isBusy, setIsBusy] = useState(false);
  const { mutate } = useJobs({
    read: false,
  });
  const dispatch = useAppDispatch();
  const runningJobIds = useAppSelector((state) => state.jobs.runningJobIds);
  const { filteredLayers } = useLayerByGeomType(
    ["feature", "table"],
    undefined,
    projectId as string,
  );

  // Target
  const [targetLayer, setTargetLayer] = useState<SelectorItem | undefined>(
    undefined,
  );
  const [targetSelectedField, setTargetSelectedField] = useState<
    LayerFieldType | undefined
  >(undefined);

  const targetLayerDatasetId = useLayerDatasetId(
    targetLayer?.value as number | undefined,
    projectId as string,
  );

  // Join
  const [joinLayer, setJoinLayer] = useState<SelectorItem | undefined>(
    undefined,
  );
  const [joinSelectedField, setJoinSelectedField] = useState<
    LayerFieldType | undefined
  >(undefined);

  useEffect(() => {
    if (targetLayer) {
      setTargetSelectedField(undefined);
    }
  }, [targetLayer]);

  const {
    statisticMethods,
    statisticMethodSelected,
    setStatisticMethodSelected,
    statisticField,
    setStatisticField,
  } = useStatisticValues();

  useEffect(() => {
    if (joinLayer) {
      setJoinSelectedField(undefined);
      setStatisticField(undefined);
    }
  }, [joinLayer, setStatisticField]);

  const joinLayerDatasetId = useLayerDatasetId(
    joinLayer?.value as number | undefined,
    projectId as string,
  );

  // Fields have to be the same type
  const { layerFields: targetFields } = useLayerFields(
    targetLayerDatasetId || "",
    joinSelectedField?.type,
  );
  const { layerFields: joinFields } = useLayerFields(
    joinLayerDatasetId || "",
    targetSelectedField?.type,
  );
  const { layerFields: allJoinFields } = useLayerFields(
    joinLayerDatasetId || "",
  );

  // List of target and join layer
  const targetLayers = useMemo(() => {
    if (!joinLayer) {
      return filteredLayers;
    }
    return filteredLayers.filter((layer) => layer.value !== joinLayer.value);
  }, [joinLayer, filteredLayers]);

  const joinLayers = useMemo(() => {
    if (!targetLayer) {
      return filteredLayers;
    }
    return filteredLayers.filter((layer) => layer.value !== targetLayer.value);
  }, [targetLayer, filteredLayers]);

  // Filters the join layer fields based on the selected statistic method
  const filteredStatisticFields = useMemo(() => {
    return allJoinFields.filter((field) => {
      if (
        statisticMethodSelected?.value === statisticOperationEnum.Enum.count
      ) {
        return field.type === "number" || field.type === "string";
      }
      return field.type === "number";
    });
  }, [allJoinFields, statisticMethodSelected]);

  // Validation
  const isValid = useMemo(() => {
    if (
      !targetLayer ||
      !joinLayer ||
      !targetSelectedField ||
      !joinSelectedField ||
      !statisticMethodSelected
    ) {
      return false;
    }
    return true;
  }, [
    targetLayer,
    joinLayer,
    targetSelectedField,
    joinSelectedField,
    statisticMethodSelected,
  ]);

  const handleRun = async () => {
    const payload = {
      target_layer_project_id: targetLayer?.value,
      target_field: targetSelectedField?.name,
      join_layer_project_id: joinLayer?.value,
      join_field: joinSelectedField?.name,
      column_statistics: {
        operation: statisticMethodSelected?.value,
        field: statisticField?.name,
      },
    };
    try {
      setIsBusy(true);
      const parsedPayload = joinSchema.parse(payload);
      const response = await computeJoin(parsedPayload, projectId as string);
      const { job_id } = response;
      if (job_id) {
        toast.info(t("join_computation_started"));
        mutate();
        dispatch(setRunningJobIds([...runningJobIds, job_id]));
      }
    } catch (error) {
      toast.error(t("error_running_join_computation"));
    } finally {
      setIsBusy(false);
      handleReset();
    }
  };
  const handleReset = () => {
    setTargetLayer(undefined);
    setJoinLayer(undefined);
    setTargetSelectedField(undefined);
    setJoinSelectedField(undefined);
    setStatisticMethodSelected(undefined);
    setStatisticField(undefined);
  };

  return (
    <Container
      disablePadding={false}
      header={<ToolsHeader onBack={onBack} title={t("join_header")} />}
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
              {t("join_description")}
            </Typography>
            <SectionHeader
              active={true}
              alwaysActive={true}
              label={t("pick_layers_to_join")}
              icon={ICON_NAME.LAYERS}
              disableAdvanceOptions={true}
            />
            <SectionOptions
              active={true}
              baseOptions={
                <>
                  <Selector
                    selectedItems={targetLayer}
                    setSelectedItems={(
                      item: SelectorItem[] | SelectorItem | undefined,
                    ) => {
                      setTargetLayer(item as SelectorItem);
                    }}
                    items={targetLayers}
                    emptyMessage={t("no_layers_found")}
                    emptyMessageIcon={ICON_NAME.LAYERS}
                    label={t("select_target_layer")}
                    placeholder={t("select_target_layer_placeholder")}
                    tooltip={t("select_target_layer_tooltip")}
                  />

                  <Selector
                    selectedItems={joinLayer}
                    setSelectedItems={(
                      item: SelectorItem[] | SelectorItem | undefined,
                    ) => {
                      setJoinLayer(item as SelectorItem);
                    }}
                    items={joinLayers}
                    emptyMessage={t("no_layers_found")}
                    emptyMessageIcon={ICON_NAME.LAYERS}
                    label={t("select_join_layer")}
                    placeholder={t("select_join_layer_placeholder")}
                    tooltip={t("select_join_layer_tooltip")}
                  />
                </>
              }
            />
            <SectionHeader
              active={!!targetLayer && !!joinLayer}
              alwaysActive={true}
              label={t("fields_to_match")}
              icon={ICON_NAME.TABLE}
              disableAdvanceOptions={true}
            />
            <SectionOptions
              active={!!targetLayer && !!joinLayer}
              baseOptions={
                <>
                  {targetLayer && (
                    <LayerFieldSelector
                      fields={targetFields}
                      selectedField={targetSelectedField}
                      disabled={!targetLayer}
                      setSelectedField={(field) => {
                        setTargetSelectedField(field);
                      }}
                      label={t("target_field")}
                      tooltip={t("target_field_tooltip")}
                    />
                  )}

                  {joinLayer && (
                    <LayerFieldSelector
                      fields={joinFields}
                      selectedField={joinSelectedField}
                      disabled={!joinLayer}
                      setSelectedField={(field) => {
                        setJoinSelectedField(field);
                      }}
                      label={t("join_field")}
                      tooltip={t("join_field_tooltip")}
                    />
                  )}
                </>
              }
            />
            <SectionHeader
              active={!!targetSelectedField && !!joinSelectedField}
              alwaysActive={true}
              label={t("statistics")}
              icon={ICON_NAME.CHART}
              disableAdvanceOptions={true}
            />
            <SectionOptions
              active={!!targetSelectedField && !!joinSelectedField}
              baseOptions={
                <>
                  <Selector
                    selectedItems={statisticMethodSelected}
                    setSelectedItems={(
                      item: SelectorItem[] | SelectorItem | undefined,
                    ) => {
                      setStatisticMethodSelected(item as SelectorItem);
                    }}
                    items={statisticMethods}
                    label={t("select_statistic_method")}
                    placeholder={t("select_statistic_method_placeholder")}
                    tooltip={t("select_statistic_method_tooltip")}
                  />

                  <LayerFieldSelector
                    fields={filteredStatisticFields}
                    selectedField={statisticField}
                    disabled={!statisticMethodSelected}
                    setSelectedField={(field) => {
                      setStatisticField(field);
                    }}
                    label={t("select_field_to_calculate_statistics")}
                    tooltip={t("select_field_to_calculate_statistics_tooltip")}
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
  );
};

export default Join;
