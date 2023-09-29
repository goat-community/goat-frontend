import { MuiFileInput } from "@/components/common/FileInput";
import { useFolders } from "@/lib/api/folders";
import type { GetContentQueryParams } from "@/lib/validations/common";
import type { Folder } from "@/lib/validations/folder";

import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import { useState } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import { ICON_NAME, Icon } from "@p4b/ui/components/Icon";
import { useForm } from "react-hook-form";
import type { FeatureLayerType, LayerMetadata } from "@/lib/validations/layer";
import {
  createNewDatasetLayerSchema,
  createNewStandardLayerSchema,
  createNewTableLayerSchema,
  layerMetadataSchema,
} from "@/lib/validations/layer";
import { zodResolver } from "@hookform/resolvers/zod";
import { createLayer } from "@/lib/api/layers";
import { toast } from "react-toastify";
import { getJob } from "@/lib/api/jobs";

interface DatasetUploadDialogProps {
  open: boolean;
  onClose?: () => void;
}

const steps = ["Select File", "Destination & Metadata", "Confirmation"];

const DatasetUploadModal: React.FC<DatasetUploadDialogProps> = ({
  open,
  onClose,
}) => {
  const queryParams: GetContentQueryParams = {
    order: "descendent",
    order_by: "updated_at",
  };
  const { folders } = useFolders(queryParams);
  const homeFolder = {
    id: "0",
    name: "Home",
    user_id: "0",
  };
  const [activeStep, setActiveStep] = useState(0);
  const [fileValue, setFileValue] = useState(null);
  const [fileUploadError, setFileUploadError] = useState<string>();
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(
    homeFolder,
  );
  const [datasetType, setDatasetType] = useState<"feature_layer" | "table">(
    "feature_layer",
  );
  const [isBusy, setIsBusy] = useState(false);

  const [featureLayerType, setFeatureLayerType] =
    useState<FeatureLayerType>("standard");

  const {
    register,
    getValues,
    reset,
    formState: { errors, isValid },
  } = useForm<LayerMetadata>({
    mode: "onChange",
    resolver: zodResolver(layerMetadataSchema),
  });

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handledBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const acceptedFileTypes = [
    ".gpkg",
    ".geojson",
    ".shp",
    ".kml",
    ".csv",
    ".xlsx",
  ];
  const handleChange = (file) => {
    setFileUploadError(undefined);
    setFileValue(null);
    if (file && file.name) {
      const isAcceptedType = acceptedFileTypes.some((type) =>
        file.name.endsWith(type),
      );
      if (!isAcceptedType) {
        setFileUploadError("Invalid file type. Please select a file of type");
        return;
      }

      // Autodetect dataset type
      const isFeatureLayer =
        file.name.endsWith(".gpkg") ||
        file.name.endsWith(".geojson") ||
        file.name.endsWith(".shp") ||
        file.name.endsWith(".kml");
      const isTable = file.name.endsWith(".csv") || file.name.endsWith(".xlsx");
      if (isFeatureLayer) {
        setDatasetType("feature_layer");
      } else if (isTable) {
        setDatasetType("table");
      }
      console.log("file", file);
      setFileValue(file);
    }
  };

  const handleOnClose = () => {
    setFileValue(null);
    setActiveStep(0);
    setSelectedFolder(homeFolder);
    setFileUploadError(undefined);
    setIsBusy(false);
    reset();
    onClose?.();
  };

  const handleUpload = async () => {
    let layerBaseInput;
    try {
      setIsBusy(true);
      if (datasetType === "feature_layer") {
        layerBaseInput = createNewStandardLayerSchema.parse({
          ...getValues(),
          folder_id: selectedFolder?.id,
          type: datasetType,
          feature_layer_type: featureLayerType,
        });
      } else if (datasetType === "table") {
        layerBaseInput = createNewTableLayerSchema.parse({
          ...getValues(),
          folder_id: selectedFolder?.id,
          type: datasetType,
        });
      }
      const payload = createNewDatasetLayerSchema.parse({
        layer_in: layerBaseInput,
        file: fileValue,
      });
      const response = await createLayer(payload);
      const jobId = response?.job_id;
      const jobDetails = await getJob(jobId);
      console.log("jobDetails", jobDetails);
    } catch (error) {
      toast.error("Error uploading dataset");
      handleOnClose();
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleOnClose} fullWidth maxWidth="sm">
      <DialogTitle>Upload Dataset</DialogTitle>
      <DialogContent>
        <Box sx={{ width: "100%" }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      </DialogContent>
      <Box sx={{ px: 4 }}>
        {activeStep === 0 && (
          <>
            <Typography variant="caption">
              Select a file to upload from your device.
            </Typography>

            <MuiFileInput
              sx={{
                my: 2,
              }}
              inputProps={{
                accept: acceptedFileTypes.join(","),
              }}
              fullWidth
              error={!!fileUploadError}
              helperText={fileUploadError}
              value={fileValue}
              multiple={false}
              onChange={handleChange}
              placeholder="E.g file.gpkg, file.geojson, shapefile.zip"
            />
            <Typography variant="caption">
              Supported files are: <b>GeoPackage</b>, <b>GeoJSON</b>,{" "}
              <b>Shapefile</b>, <b>KML</b>, <b>CSV</b>, <b>XLSX</b>
            </Typography>
          </>
        )}
        {activeStep === 1 && (
          <>
            <Stack direction="column" spacing={4}>
              <Autocomplete
                fullWidth
                value={selectedFolder}
                onChange={(_event, newValue) => {
                  setSelectedFolder(newValue);
                }}
                autoHighlight
                id="folder-select"
                options={
                  folders?.items ? [homeFolder, ...folders.items] : [homeFolder]
                }
                getOptionLabel={(option) => {
                  if (typeof option === "string") {
                    return option;
                  }
                  return option.name;
                }}
                renderOption={(props, option) => (
                  <ListItem {...props}>
                    <ListItemIcon>
                      <Icon
                        iconName={
                          option?.id === "0"
                            ? ICON_NAME.HOUSE
                            : ICON_NAME.FOLDER
                        }
                        style={{ marginLeft: 2 }}
                        fontSize="small"
                      />
                    </ListItemIcon>
                    <ListItemText primary={option.name} />
                  </ListItem>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    sx={{
                      mt: 4,
                    }}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <Icon
                            iconName={
                              selectedFolder?.id === "0"
                                ? ICON_NAME.HOUSE
                                : ICON_NAME.FOLDER
                            }
                            style={{ marginLeft: 2 }}
                            fontSize="small"
                          />
                        </InputAdornment>
                      ),
                    }}
                    label="Select Folder Destination"
                  />
                )}
              />

              <TextField
                fullWidth
                required
                label="Name"
                {...register("name")}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                {...register("description")}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            </Stack>
          </>
        )}
        {activeStep === 2 && (
          <Stack direction="column" spacing={4}>
            <Typography variant="caption">
              Please review the details below before uploading the dataset.
            </Typography>
            <Select
              fullWidth
              labelId="dataset-type"
              value={datasetType}
              label="Dataset Type"
              onChange={(event) => {
                setDatasetType(event.target.value as "feature_layer" | "table");
              }}
            >
              <MenuItem value="feature_layer">
                <Stack
                  direction="row"
                  spacing={2}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Icon iconName={ICON_NAME.MAP} fontSize="small" />
                  <ListItemText primary="Feature Layer" />
                </Stack>
              </MenuItem>
              <MenuItem value="table">
                <Stack
                  direction="row"
                  spacing={2}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Icon iconName={ICON_NAME.TABLE} fontSize="small" />
                  <ListItemText primary="Table" />
                </Stack>
              </MenuItem>
            </Select>
            <Typography variant="body2">
              <b>File:</b> {fileValue?.name}
            </Typography>
            <Typography variant="body2">
              <b>Destination:</b> {selectedFolder?.name}
            </Typography>
            <Typography variant="body2">
              <b>Name:</b> {getValues("name")}
            </Typography>
            <Typography variant="body2">
              <b>Description:</b> {getValues("description")}
            </Typography>
          </Stack>
        )}
      </Box>
      <DialogActions
        disableSpacing
        sx={{
          pt: 6,
          pb: 2,
          justifyContent: "space-between",
        }}
      >
        <Stack direction="row" spacing={2} justifyContent="flex-start">
          {activeStep > 0 && (
            <Button variant="text" onClick={handledBack}>
              <Typography variant="body2" fontWeight="bold">
                Back
              </Typography>
            </Button>
          )}
        </Stack>
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button onClick={handleOnClose} variant="text">
            <Typography variant="body2" fontWeight="bold">
              Cancel
            </Typography>
          </Button>
          {activeStep < steps.length - 1 && (
            <Button
              disabled={
                (activeStep === 0 && fileValue === null) ||
                (activeStep === 1 &&
                  (isValid !== true || selectedFolder === null))
              }
              onClick={handleNext}
              variant="outlined"
              color="primary"
            >
              <Typography variant="body2" fontWeight="bold" color="inherit">
                Next
              </Typography>
            </Button>
          )}
          {activeStep === steps.length - 1 && (
            <LoadingButton
              onClick={handleUpload}
              disabled={isBusy}
              loading={isBusy}
              variant="contained"
              color="primary"
            >
              <Typography variant="body2" fontWeight="bold" color="inherit">
                Upload
              </Typography>
            </LoadingButton>
          )}
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default DatasetUploadModal;