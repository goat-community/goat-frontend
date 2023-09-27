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
import { useState } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import { ICON_NAME, Icon } from "@p4b/ui/components/Icon";

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
      setFileValue(file);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
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
            <Stack direction="column" spacing={2}>
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
                      my: 4,
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
                id="dataset-title"
                label="Title"
                variant="outlined"
              />
            </Stack>
          </>
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
          <Button onClick={onClose} variant="text">
            <Typography variant="body2" fontWeight="bold">
              Cancel
            </Typography>
          </Button>
          {activeStep < steps.length - 1 && (
            <Button
              disabled={
                (activeStep === 0 && fileValue === null) ||
                (activeStep === 1 && selectedFolder === null)
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
            <Button onClick={handleNext} variant="contained" color="primary">
              <Typography variant="body2" fontWeight="bold" color="inherit">
                Upload
              </Typography>
            </Button>
          )}
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default DatasetUploadModal;
