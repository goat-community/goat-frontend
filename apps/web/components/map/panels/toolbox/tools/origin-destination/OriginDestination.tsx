import { Box, Typography, useTheme } from "@mui/material";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import { ICON_NAME } from "@p4b/ui/components/Icon";

import { useTranslation } from "@/i18n/client";

import { useJobs } from "@/lib/api/jobs";
import { computeOriginDestination } from "@/lib/api/tools";
import { setRunningJobIds } from "@/lib/store/jobs/slice";
import type { LayerFieldType } from "@/lib/validations/layer";
import { originDestinationMatrixSchema } from "@/lib/validations/tools";

import type { SelectorItem } from "@/types/map/common";
import type { IndicatorBaseProps } from "@/types/map/toolbox";

import useLayerFields from "@/hooks/map/CommonHooks";
import { useLayerByGeomType, useLayerDatasetId } from "@/hooks/map/ToolsHooks";
import { useAppDispatch, useAppSelector } from "@/hooks/store/ContextHooks";

import LayerFieldSelector from "@/components/map/common/LayerFieldSelector";
import Container from "@/components/map/panels/Container";
import SectionHeader from "@/components/map/panels/common/SectionHeader";
import SectionOptions from "@/components/map/panels/common/SectionOptions";
import Selector from "@/components/map/panels/common/Selector";
import ToolboxActionButtons from "@/components/map/panels/common/ToolboxActionButtons";
import ToolsHeader from "@/components/map/panels/common/ToolsHeader";

const OriginDestination = ({ onBack, onClose }: IndicatorBaseProps) => {
  const { t } = useTranslation("common");
  const theme = useTheme();
  const [isBusy, setIsBusy] = useState(false);
  const { mutate } = useJobs({
    read: false,
  });
  const dispatch = useAppDispatch();
  const runningJobIds = useAppSelector((state) => state.jobs.runningJobIds);
  const { projectId } = useParams();

  const { filteredLayers: filteredODLayers } = useLayerByGeomType(
    ["feature"],
    ["polygon", "point"],
    projectId as string
  );
  const { filteredLayers: filteredODMatrices } = useLayerByGeomType(
    ["table"],
    undefined,
    projectId as string
  );
  // OD Layer
  const [ODLayer, setODLayer] = useState<SelectorItem | undefined>(undefined);
  const odLayerDatasetId = useLayerDatasetId(ODLayer?.value as number | undefined, projectId as string);
  const { layerFields: ODLayerFields } = useLayerFields(odLayerDatasetId || "");
  const [uniqueIdField, setUniqueIdField] = useState<LayerFieldType | undefined>(undefined);

  // reset OdLayerFields when ODLayer changes
  useEffect(() => {
    setUniqueIdField(undefined);
  }, [ODLayer]);

  // OD Matrix
  const [ODMatrix, setODMatrix] = useState<SelectorItem | undefined>(undefined);
  const odMatrixDatasetId = useLayerDatasetId(ODMatrix?.value as number | undefined, projectId as string);
  const { layerFields: ODMatrixFields } = useLayerFields(odMatrixDatasetId || "");

  const [originField, setOriginField] = useState<LayerFieldType | undefined>(undefined);
  const [destinationField, setDestinationField] = useState<LayerFieldType | undefined>(undefined);

  const [weightField, setWeightField] = useState<LayerFieldType | undefined>(undefined);

  useEffect(() => {
    setOriginField(undefined);
    setDestinationField(undefined);
    setWeightField(undefined);
  }, [ODMatrix]);

  const useFilteredFields = (
    ODMatrixFields: LayerFieldType[] | undefined,
    excludeFieldNames: (string | undefined)[],
    selectedField?: LayerFieldType,
    allowedTypes?: string[]
  ) => {
    return useMemo(() => {
      if (!ODMatrixFields) return [];
      const validFieldNames = excludeFieldNames.filter(Boolean); // Remove undefined values
      return ODMatrixFields.filter(
        (field) =>
          field.name === selectedField?.name ||
          (!validFieldNames.includes(field.name) && (!allowedTypes || allowedTypes.includes(field.type)))
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ODMatrixFields, ...excludeFieldNames, selectedField]);
  };

  const originFields = useFilteredFields(
    ODMatrixFields,
    [destinationField?.name, weightField?.name],
    originField
  );
  const destinationFields = useFilteredFields(
    ODMatrixFields,
    [originField?.name, weightField?.name],
    destinationField
  );
  const weightFields = useFilteredFields(
    ODMatrixFields,
    [originField?.name, destinationField?.name],
    weightField,
    ["number"]
  );

  const isValid = useMemo(() => {
    if (!ODLayer || !ODMatrix || !uniqueIdField || !originField || !destinationField || !weightField) {
      return false;
    }
    return true;
  }, [ODLayer, ODMatrix, destinationField, originField, uniqueIdField, weightField]);

  const handleRun = async () => {
    const payload = {
      geometry_layer_project_id: ODLayer?.value,
      origin_destination_matrix_layer_project_id: ODMatrix?.value,
      unique_id_column: uniqueIdField?.name,
      origin_column: originField?.name,
      destination_column: destinationField?.name,
      weight_column: weightField?.name,
    };
    try {
      setIsBusy(true);
      const parsedPayload = originDestinationMatrixSchema.parse(payload);
      const response = await computeOriginDestination(parsedPayload, projectId as string);
      const { job_id } = response;
      if (job_id) {
        toast.info(t("od_matrix_computation_started"));
        mutate();
        dispatch(setRunningJobIds([...runningJobIds, job_id]));
      }
    } catch (error) {
      toast.error(t("error_running_od_matrix_computation"));
    } finally {
      setIsBusy(false);
      handleReset();
    }
  };

  const handleReset = () => {
    setUniqueIdField(undefined);
    setOriginField(undefined);
    setDestinationField(undefined);
    setWeightField(undefined);
    setODLayer(undefined);
    setODMatrix(undefined);
  };

  return (
    <>
      <Container
        disablePadding={false}
        header={<ToolsHeader onBack={onBack} title={t("origin_destination_header")} />}
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
                {t("origin_destination_description")}
              </Typography>
              {/* OD LAYER && MATRIX */}
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
                      selectedItems={ODLayer}
                      setSelectedItems={(item: SelectorItem[] | SelectorItem | undefined) => {
                        setODLayer(item as SelectorItem);
                      }}
                      items={filteredODLayers}
                      emptyMessage={t("no_polygon_or_point_layers")}
                      emptyMessageIcon={ICON_NAME.LAYERS}
                      label={t("od_geometries_layer")}
                      placeholder={t("select_layer")}
                      tooltip={t("od_geometries_layer_tooltip")}
                    />

                    <LayerFieldSelector
                      fields={ODLayerFields}
                      selectedField={uniqueIdField}
                      disabled={!ODLayer}
                      setSelectedField={(field) => {
                        setUniqueIdField(field);
                      }}
                      label={t("unique_id_field")}
                      tooltip={t("unique_id_field_tooltip")}
                    />
                  </>
                }
              />

              <SectionHeader
                active={true}
                alwaysActive={true}
                label={t("matrix")}
                icon={ICON_NAME.TABLE}
                disableAdvanceOptions={true}
              />

              <SectionOptions
                active={true}
                baseOptions={
                  <>
                    <Selector
                      selectedItems={ODMatrix}
                      setSelectedItems={(item: SelectorItem[] | SelectorItem | undefined) => {
                        setODMatrix(item as SelectorItem);
                      }}
                      items={filteredODMatrices}
                      emptyMessage={t("no_table_layers")}
                      emptyMessageIcon={ICON_NAME.TABLE}
                      label={t("od_matrix")}
                      placeholder={t("select_table")}
                      tooltip={t("od_matrix_tooltip")}
                    />
                    <LayerFieldSelector
                      fields={originFields}
                      selectedField={originField}
                      disabled={!ODMatrix}
                      setSelectedField={(field) => {
                        setOriginField(field);
                      }}
                      label={t("origin_field")}
                      tooltip={t("origin_field_tooltip")}
                    />
                    <LayerFieldSelector
                      fields={destinationFields}
                      selectedField={destinationField}
                      disabled={!ODMatrix}
                      setSelectedField={(field) => {
                        setDestinationField(field);
                      }}
                      label={t("destination_field")}
                      tooltip={t("destination_field_tooltip")}
                    />
                    <LayerFieldSelector
                      fields={weightFields}
                      selectedField={weightField}
                      disabled={!ODMatrix}
                      setSelectedField={(field) => {
                        setWeightField(field);
                      }}
                      label={t("weight_field")}
                      tooltip={t("weight_field_tooltip")}
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

export default OriginDestination;
