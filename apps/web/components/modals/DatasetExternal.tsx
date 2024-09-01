/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Radio,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import WMSCapabilities from "ol/format/WMSCapabilities";
import WMTSCapabilities from "ol/format/WMTSCapabilities";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { ICON_NAME } from "@p4b/ui/components/Icon";

import { useTranslation } from "@/i18n/client";

import { useFolders } from "@/lib/api/folders";
import { useJobs } from "@/lib/api/jobs";
import { createFeatureLayer, createRasterLayer, layerFeatureUrlUpload } from "@/lib/api/layers";
import { setRunningJobIds } from "@/lib/store/jobs/slice";
import { convertWmtsToXYZUrl, getWmtsFlatLayers } from "@/lib/transformers/wmts";
import WFSCapabilities from "@/lib/utils/parser/ol/format/WFSCapabilities";
import type { DataType, GetContentQueryParams } from "@/lib/validations/common";
import { imageryDataType, vectorDataType } from "@/lib/validations/common";
import type { Folder } from "@/lib/validations/folder";
import type { LayerMetadata } from "@/lib/validations/layer";
import {
  createLayerFromDatasetSchema,
  createRasterLayerSchema,
  externalDatasetFeatureUrlSchema,
  layerMetadataSchema,
} from "@/lib/validations/layer";

import { useAppDispatch, useAppSelector } from "@/hooks/store/ContextHooks";

import { OverflowTypograpy } from "@/components/common/OverflowTypography";
import FolderSelect from "@/components/dashboard/common/FolderSelect";

interface DatasetExternalProps {
  open: boolean;
  onClose?: () => void;
  projectId?: string;
}

interface ExternalDatasetType {
  name: string;
  value: DataType;
  urlPlaceholder: string;
  icon: ICON_NAME;
}

interface CapabilitiesType {
  type: DataType;
  capabilities: any;
}

const externalDatasetTypes: ExternalDatasetType[] = [
  {
    name: "Web Map Service (WMS)",
    value: imageryDataType.Enum.wms,
    urlPlaceholder: "https://serviceurl.com",
    icon: ICON_NAME.WMS,
  },
  {
    name: "Web Map Tile Service (WMTS)",
    value: imageryDataType.Enum.wmts,
    urlPlaceholder: "https://serviceurl.com",
    icon: ICON_NAME.WMTS,
  },
  {
    name: "Web Feature Service (WFS)",
    value: vectorDataType.Enum.wfs,
    urlPlaceholder: "https://serviceurl.com",
    icon: ICON_NAME.WFS,
  },
];

const DatasetsSelectTable = ({ options, type, selectedDatasets, setSelectedDatasets }) => {
  const { t } = useTranslation("common");
  const columnsMap = {
    wfs: ["Title", "Name", "Abstract"],
    wms: ["Title", "Name", "Abstract"],
    wmts: ["Title", "Identifier", "Style", "Abstract"],
  };

  const handleSelectDataset = (dataset) => {
    setSelectedDatasets((prevSelectedDatasets) => {
      if (type === vectorDataType.Enum.wfs || type === imageryDataType.Enum.wmts) {
        return [dataset]; // Allow only one selection
      }
      if (prevSelectedDatasets.includes(dataset)) {
        return prevSelectedDatasets.filter((d) => d !== dataset);
      }
      return [...prevSelectedDatasets, dataset];
    });
  };

  const getColumns = (datasetType) => {
    return columnsMap[datasetType] || [];
  };

  return (
    <>
      <Stack direction="row" sx={{ mb: 2 }}>
        <Typography variant="body2">
          <b>{t("type")}:</b> {externalDatasetTypes.find((d) => d.value === type)?.name || type}
        </Typography>
      </Stack>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox" />
            {options.length > 0 &&
              getColumns(type).map((column) => <TableCell key={column}>{column}</TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {options.map((dataset) => (
            <TableRow
              key={dataset.Name}
              sx={{
                cursor: "pointer",
              }}
              selected={selectedDatasets.includes(dataset)}
              onClick={() => handleSelectDataset(dataset)}>
              <TableCell padding="checkbox">
                {type === "wfs" || type === "wmts" ? (
                  <Radio
                    size="small"
                    checked={selectedDatasets.includes(dataset)}
                    onChange={() => handleSelectDataset(dataset)}
                    onClick={(e) => e.stopPropagation()} // Prevent row click event
                  />
                ) : (
                  <Checkbox
                    size="small"
                    checked={selectedDatasets.includes(dataset)}
                    onChange={() => handleSelectDataset(dataset)}
                    onClick={(e) => e.stopPropagation()} // Prevent row click event
                  />
                )}
              </TableCell>
              {getColumns(type).map((column) => (
                <TableCell
                  key={column}
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: 150,
                  }}>
                  <OverflowTypograpy variant="body2" tooltipProps={{ placement: "top", arrow: true }}>
                    {dataset[column]}
                  </OverflowTypograpy>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
const DatasetExternal: React.FC<DatasetExternalProps> = ({ open, onClose, projectId }) => {
  const { t } = useTranslation("common");
  const dispatch = useAppDispatch();
  const runningJobIds = useAppSelector((state) => state.jobs.runningJobIds);
  const { mutate } = useJobs({
    read: false,
  });
  // Step 0: Enter URL
  const steps = [t("enter_url"), t("select_dataset"), t("destination_and_metadata"), t("confirmation")];

  const [activeStep, setActiveStep] = useState(0);
  const [externalUrl, setExternalUrl] = useState<string | null>(null);
  const [capabilities, setCapabilities] = useState<CapabilitiesType | null>(null);

  // Step 1: Select Layer

  // The reason why this is an array is because WMS can have multiple layers.
  // Technically, WFS can have multiple layers too but we only support one layer to be able to use features for analytics.
  const [selectedDatasets, setSelectedDatasets] = useState<any[]>([]);

  const datasetOptions = useMemo(() => {
    const options = [] as any[];
    const _capabilities = capabilities?.capabilities;
    if (capabilities?.type === vectorDataType.Enum.wfs) {
      const version = _capabilities?.version;
      const datasets =
        version === "2.0.0" ? _capabilities?.FeatureTypeList : _capabilities?.FeatureTypeList?.FeatureType;
      if (datasets?.length) {
        datasets.forEach((dataset: any) => {
          options.push(dataset);
        });
      }
    } else if (capabilities?.type === imageryDataType.Enum.wms) {
      const datasets = _capabilities?.Capability?.Layer;
      if (datasets?.length) {
        datasets.forEach((dataset: any) => {
          options.push(dataset);
        });
      }
    } else if (capabilities?.type === imageryDataType.Enum.wmts) {
      const datasets = getWmtsFlatLayers(_capabilities);
      options.push(...datasets);
    }

    return options;
  }, [capabilities]);

  // Step 2: Destination and Metadata
  const queryParams: GetContentQueryParams = {
    order: "descendent",
    order_by: "updated_at",
  };
  const { folders } = useFolders(queryParams);
  const {
    register,
    reset,
    setValue,
    getValues,
    formState: { errors, isValid },
  } = useForm<LayerMetadata>({
    mode: "onChange",
    resolver: zodResolver(layerMetadataSchema),
  });

  const [selectedFolder, setSelectedFolder] = useState<Folder | null>();

  // Other
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  const handleNext = () => {
    // STEP 0: Parse URL.
    if (activeStep === 0) {
      if (!externalUrl) return;
      setIsBusy(true);
      // todo: in future we should allows geojson, mvt or other formats. So it doesn't always have to fetch capabilities.
      // Assuming this is a capabilities ogc service
      fetch(externalUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error(t("error_loading_external_dataset"));
          }
          return response.text();
        })
        .then((text) => {
          const wmsSchema = "opengis.net/wms";
          const wmtsSchema = "opengis.net/wmts";
          const wfsSchema = "opengis.net/wfs";
          let type = null as DataType | null;
          if (text.includes(wmsSchema)) {
            type = imageryDataType.Enum.wms;
          } else if (text.includes(wfsSchema)) {
            type = vectorDataType.Enum.wfs;
          } else if (text.includes(wmtsSchema)) {
            type = imageryDataType.Enum.wmts;
          }
          let parser;
          if (type === vectorDataType.Enum.wfs) {
            parser = new WFSCapabilities();
          } else if (type === imageryDataType.Enum.wms) {
            parser = new WMSCapabilities();
          } else if (type === imageryDataType.Enum.wmts) {
            parser = new WMTSCapabilities();
          } else {
            throw new Error("Could not determine the service type");
          }

          const capabilities = parser.read(text);
          console.log(capabilities);
          setCapabilities({ type, capabilities });
          setActiveStep((prevActiveStep) => prevActiveStep + 1);
        })
        .catch((_error) => {
          setErrorMessage(t("error_loading_external_dataset"));
        })
        .finally(() => {
          setIsBusy(false);
        });
    }
    // STEP 1: Select Dataset
    else if (activeStep === 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      const homeFolder = folders?.find((folder) => folder.name === "home");
      if (homeFolder) {
        setSelectedFolder(homeFolder);
      }
      if (
        (capabilities?.type === vectorDataType.Enum.wfs ||
          capabilities?.type === imageryDataType.enum.wmts) &&
        selectedDatasets.length
      ) {
        setValue("name", selectedDatasets[0].Title || selectedDatasets[0].Name || "");
        setValue("description", selectedDatasets[0].Abstract || "");
      }

      console.log(selectedDatasets);
    } else if (activeStep === 2) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };
  const handledBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleSave = async () => {
    const layerPayload = {
      ...getValues(),
      folder_id: selectedFolder?.id,
    };
    try {
      setIsBusy(true);
      if (capabilities?.type === vectorDataType.Enum.wfs) {
        const featureUrlPayload = externalDatasetFeatureUrlSchema.parse({
          data_type: capabilities.type,
          url: externalUrl,
          other_properties: {
            layers: [selectedDatasets[0].Name],
            srs: selectedDatasets[0].DefaultCRS,
          },
        });
        const uploadResponse = await layerFeatureUrlUpload(featureUrlPayload);
        const datasetId = uploadResponse?.dataset_id;
        console.log(datasetId);
        const payload = createLayerFromDatasetSchema.parse({
          ...layerPayload,
          dataset_id: datasetId,
        });
        const response = await createFeatureLayer(payload, projectId);
        const jobId = response?.job_id;
        if (jobId) {
          mutate();
          dispatch(setRunningJobIds([...runningJobIds, jobId]));
        }
      } else if (
        capabilities?.type === imageryDataType.Enum.wms ||
        capabilities?.type === imageryDataType.Enum.wmts
      ) {
        let layers;
        let url = externalUrl;
        if (capabilities.type === imageryDataType.Enum.wms) {
          layers = selectedDatasets.map((d) => d.Name);
        } else if (capabilities.type === imageryDataType.Enum.wmts) {
          layers = selectedDatasets.map((d) => d.Identifier);
          url = convertWmtsToXYZUrl(
            selectedDatasets[0].ResourceURL,
            selectedDatasets[0].Style,
            selectedDatasets[0].TileMatrixSet
          );
        }
        if (!layers.length) {
          throw new Error("No layers selected");
        }

        console.log(selectedDatasets);
        const payload = createRasterLayerSchema.parse({
          ...layerPayload,
          type: "raster",
          data_type: capabilities.type,
          url,
          other_properties: {
            layers,
          },
        });
        console.log(payload);
        const rasterLayerResponse = await createRasterLayer(payload);
        console.log(rasterLayerResponse);
      }

      toast.success(t("success_adding_external_dataset"));
    } catch (error) {
      console.error(error);
      toast.error(t("error_adding_external_dataset"));
    } finally {
      setIsBusy(false);
      handleOnClose();
    }
  };
  const handleOnClose = () => {
    setExternalUrl(null);
    setCapabilities(null);
    setSelectedDatasets([]);
    setActiveStep(0);
    cleanDestinationAndMetadata();
    reset();
    onClose && onClose();
  };

  const cleanDestinationAndMetadata = () => {
    setSelectedFolder(null);
    reset();
  };

  const isNextDisabled = useMemo(() => {
    if (activeStep === 0) {
      return !externalUrl;
    }
    if (activeStep === 1) {
      return !selectedDatasets?.length;
    }
    if (activeStep === 2) {
      return !selectedFolder || !isValid;
    }

    return false;
  }, [activeStep, externalUrl, selectedDatasets?.length, selectedFolder, isValid]);

  return (
    <>
      <Dialog open={open} onClose={handleOnClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {t("dataset_external")}
          <Box sx={{ width: "100%", pt: 6 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ width: "100%" }}>
            {activeStep === 0 && (
              <>
                <TextField
                  id="enter-url"
                  variant="outlined"
                  fullWidth
                  error={!!errorMessage}
                  helperText={errorMessage}
                  placeholder={t("url")}
                  onChange={(e) => {
                    console.log(e.target.value);
                    setErrorMessage(null);
                    setExternalUrl(e.target.value);
                    setCapabilities(null);
                    setSelectedDatasets([]);
                    cleanDestinationAndMetadata();
                  }}
                />
                <Typography variant="caption">
                  {t("supported_services")}{" "}
                  {externalDatasetTypes.map((datasetType, index) => (
                    <b key={datasetType.value}>
                      {datasetType.name}
                      {index < externalDatasetTypes.length - 1 ? ", " : ""}
                    </b>
                  ))}
                </Typography>
              </>
            )}
            {activeStep === 1 && (
              <Stack
                direction="column"
                sx={{
                  py: 2,
                }}>
                <DatasetsSelectTable
                  options={datasetOptions}
                  type={capabilities?.type}
                  selectedDatasets={selectedDatasets}
                  setSelectedDatasets={setSelectedDatasets}
                />
              </Stack>
            )}

            {activeStep === 2 && (
              <>
                <Stack direction="column" spacing={4}>
                  <FolderSelect
                    folders={folders}
                    selectedFolder={selectedFolder}
                    setSelectedFolder={setSelectedFolder}
                  />

                  <TextField
                    fullWidth
                    required
                    label={t("name")}
                    {...register("name")}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label={t("description")}
                    {...register("description")}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                </Stack>
              </>
            )}

            {activeStep === 3 && (
              <Stack direction="column" spacing={4}>
                <Typography variant="caption">{t("review_dataset_external")}</Typography>
                <Typography variant="body2">
                  <b>{t("url")}:</b> {externalUrl}
                </Typography>
                <Typography variant="body2">
                  <b>{t("type")}:</b>{" "}
                  {externalDatasetTypes.find((d) => d.value === capabilities?.type)?.name ||
                    capabilities?.type}
                </Typography>
                <Typography variant="body2">
                  <b>{t("destination")}:</b> {selectedFolder?.name}
                </Typography>
                <Typography variant="body2">
                  <b>{t("name")}:</b> {getValues("name")}
                </Typography>
                <Typography variant="body2">
                  <b>{t("description")}:</b> {getValues("description")}
                </Typography>
              </Stack>
            )}
          </Box>
        </DialogContent>

        <DialogActions
          disableSpacing
          sx={{
            pt: 6,
            pb: 2,
            justifyContent: "space-between",
          }}>
          <Stack direction="row" spacing={2} justifyContent="flex-start">
            {activeStep > 0 && (
              <Button variant="text" onClick={handledBack}>
                <Typography variant="body2" fontWeight="bold">
                  {t("back")}
                </Typography>
              </Button>
            )}
          </Stack>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button onClick={handleOnClose} variant="text">
              <Typography variant="body2" fontWeight="bold">
                {t("cancel")}
              </Typography>
            </Button>

            {activeStep < steps.length - 1 && (
              <LoadingButton
                disabled={isNextDisabled}
                onClick={handleNext}
                loading={isBusy}
                variant="outlined"
                color="primary">
                <Typography variant="body2" fontWeight="bold" color="inherit">
                  {t("next")}
                </Typography>
              </LoadingButton>
            )}

            {activeStep === steps.length - 1 && (
              <LoadingButton onClick={handleSave} variant="outlined" color="primary" loading={isBusy}>
                <Typography variant="body2" fontWeight="bold" color="inherit">
                  {t("save")}
                </Typography>
              </LoadingButton>
            )}
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DatasetExternal;
