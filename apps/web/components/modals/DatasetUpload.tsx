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
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import { useEffect, useMemo, useState } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import { ICON_NAME, Icon } from "@p4b/ui/components/Icon";
import { useForm } from "react-hook-form";
import type { LayerMetadata } from "@/lib/validations/layer";
import {
  createFeatureLayerSchema,
  layerMetadataSchema,
} from "@/lib/validations/layer";
import { zodResolver } from "@hookform/resolvers/zod";
import { createInternalLayer, layerFileUpload } from "@/lib/api/layers";
import { toast } from "react-toastify";
import { useJobs } from "@/lib/api/jobs";
import { useTranslation } from "@/i18n/client";

interface DatasetUploadDialogProps {
  open: boolean;
  onClose?: () => void;
}

const DatasetUploadModal: React.FC<DatasetUploadDialogProps> = ({
  open,
  onClose,
}) => {
  const { t } = useTranslation("dashboard");

  const steps = [
    t("projects.dataset.select_file"),
    t("projects.dataset.destination_and_metadata"),
    t("projects.dataset.confirmation"),
  ];
  const { mutate } = useJobs({
    read: false,
  });
  const queryParams: GetContentQueryParams = {
    order: "descendent",
    order_by: "updated_at",
  };
  const { folders } = useFolders(queryParams);
  const [activeStep, setActiveStep] = useState(0);
  const [fileValue, setFileValue] = useState<File>();
  const [fileUploadError, setFileUploadError] = useState<string>();
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>();
  const [datasetType, setDatasetType] = useState<"feature_layer" | "table">(
    "feature_layer",
  );
  const [isBusy, setIsBusy] = useState(false);
  useEffect(() => {
    const homeFolder = folders?.find((folder) => folder.name === "home");
    if (homeFolder) {
      setSelectedFolder(homeFolder);
    }
  }, [folders]);

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

  const acceptedFileTypes = useMemo(() => {
    return [".gpkg", ".geojson", ".shp", ".kml", ".csv", ".xlsx"];
  }, []);

  const handleChange = (file) => {
    setFileUploadError(undefined);
    setFileValue(undefined);
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
    setFileValue(undefined);
    setActiveStep(0);
    setFileUploadError(undefined);
    setIsBusy(false);
    reset();
    onClose?.();
  };

  const fileName = useMemo(() => {
    if (fileValue) {
      // remove extension if in accepted file types
      const fileExtension = fileValue.name.split(".").pop();
      if (fileExtension && acceptedFileTypes.includes(`.${fileExtension}`)) {
        return fileValue.name.replace(`.${fileExtension}`, "");
      }
      return fileValue.name;
    }
    return "";
  }, [acceptedFileTypes, fileValue]);

  const handleUpload = async () => {
    console.log(fileValue);
    try {
      setIsBusy(true);
      if (
        (datasetType === "feature_layer" || datasetType === "table") &&
        fileValue !== undefined
      ) {
        const uploadResponse = await layerFileUpload(fileValue);
        const datasetId = uploadResponse?.dataset_id;
        const payload = createFeatureLayerSchema.parse({
          ...getValues(),
          folder_id: selectedFolder?.id,
          dataset_id: datasetId,
        });
        const response = await createInternalLayer(payload);
        const jobId = response?.job_id;
        if (jobId) {
          mutate();
        }
      }
    } catch (error) {
      toast.error("Error uploading dataset");
      console.error("error", error);
    } finally {
      handleOnClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleOnClose} fullWidth maxWidth="sm">
      <DialogTitle>{t("projects.dataset.upload_dataset")}</DialogTitle>
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
              {t("projects.dataset.select_file_to_upload")}
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
              placeholder={`${t(
                "projects.dataset.eg",
              )} file.gpkg, file.geojson, shapefile.zip`}
            />
            <Typography variant="caption">
              {t("projects.dataset.supported")} <b>GeoPackage</b>,{" "}
              <b>GeoJSON</b>, <b>Shapefile</b>, <b>KML</b>, <b>CSV</b>,{" "}
              <b>XLSX</b>
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
                options={folders ? [...folders] : []}
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
                    label={t("projects.dataset.select_folder_destination")}
                  />
                )}
              />

              <TextField
                fullWidth
                required
                defaultValue={fileName}
                label={t("projects.dataset.name")}
                {...register("name")}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
              <TextField
                fullWidth
                multiline
                rows={4}
                label={t("projects.dataset.description")}
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
              {t("projects.dataset.review")}
            </Typography>
            <Typography variant="body2">
              <b>{t("projects.dataset.file")}:</b> {fileValue?.name}
            </Typography>
            <Typography variant="body2">
              <b>{t("projects.dataset.destination")}:</b> {selectedFolder?.name}
            </Typography>
            <Typography variant="body2">
              <b>{t("projects.dataset.name")}:</b> {getValues("name")}
            </Typography>
            <Typography variant="body2">
              <b>{t("projects.dataset.description")}:</b>{" "}
              {getValues("description")}
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
                {t("next")}
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
                {t("projects.dataset.upload")}
              </Typography>
            </LoadingButton>
          )}
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default DatasetUploadModal;
