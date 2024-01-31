import { useTranslation } from "@/i18n/client";
import { downloadDataset } from "@/lib/api/layers";
import type { FeatureDataExchangeType } from "@/lib/validations/common";
import {
  featureDataExchangeCRS,
  featureDataExchangeType,
  tableDataExchangeType,
} from "@/lib/validations/common";
import type { DatasetDownloadRequest, Layer } from "@/lib/validations/layer";
import type { ProjectLayer } from "@/lib/validations/project";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  Stack,
  Typography,
  Box,
} from "@mui/material";

import { useState } from "react";
import { toast } from "react-toastify";

interface DownloadDatasetDialogProps {
  open: boolean;
  onClose?: () => void;
  disabled?: boolean;
  type: "layer" | "dataset";
  onDownload?: () => void;
  dataset: ProjectLayer | Layer;
}

const DatsetDownloadModal: React.FC<DownloadDatasetDialogProps> = ({
  open,
  disabled,
  onClose,
  onDownload,
  type,
  dataset,
}) => {
  const { t } = useTranslation("maps");
  const [dataDownloadType, setDataDownloadType] =
    useState<FeatureDataExchangeType>(
      dataset.type === "feature"
        ? featureDataExchangeType.Enum.gpkg
        : tableDataExchangeType.Enum.csv,
    );

  const [isBusy, setIsBusy] = useState(false);

  const [dataCrs, setDataCrs] = useState<string | null>(
    dataset.type === "feature" ? featureDataExchangeCRS.Enum["3857"] : null,
  );

  const handleDownload = async () => {
    try {
      if (!dataset) return;
      setIsBusy(true);
      const payload = {
        id: dataset.id,
        file_type: dataDownloadType,
        file_name: dataset.name,
      };
      if (dataCrs) {
        payload["crs"] = `EPSG:${dataCrs}`;
      }
      if (type === "layer" && dataset["query"]) {
        payload["query"] = dataset["query"];
      }

      await downloadDataset(payload as DatasetDownloadRequest);
    } catch {
      toast.error(`${t("error_downloading")} ${dataset.name}`);
    } finally {
      setIsBusy(false);
    }

    onDownload?.();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{`${t("download")} "${dataset.name}"`}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ py: 2 }}>
          <Box>
            <Typography variant="caption">{t(`download_type`)}</Typography>
            <Select
              fullWidth
              disabled={isBusy}
              sx={{
                my: 2,
              }}
              id="download-simple-select"
              value={dataDownloadType}
              onChange={(e) =>
                setDataDownloadType(e.target.value as FeatureDataExchangeType)
              }
            >
              {dataset.type === "feature" &&
                featureDataExchangeType.options.map((type: string) => (
                  <MenuItem key={type} value={type}>
                    {t(`${type}`)}
                  </MenuItem>
                ))}
              {dataset.type !== "feature" &&
                tableDataExchangeType.options.map((type: string) => (
                  <MenuItem key={type} value={type}>
                    {t(`${type}`)}
                  </MenuItem>
                ))}
            </Select>
          </Box>
          {dataset.type === "feature" && (
            <Box>
              <Typography variant="caption">{t(`download_crs`)}</Typography>
              <Select
                fullWidth
                disabled={isBusy}
                sx={{
                  my: 2,
                }}
                id="download-crs-select"
                value={dataCrs}
                onChange={(e) => setDataCrs(e.target.value as string)}
              >
                {dataset.type === "feature" &&
                  featureDataExchangeCRS.options.map((type: string) => (
                    <MenuItem key={type} value={type}>
                      {t(`${type}`)}
                    </MenuItem>
                  ))}
              </Select>
            </Box>
          )}
        </Stack>
      </DialogContent>
      <DialogActions
        disableSpacing
        sx={{
          pb: 2,
        }}
      >
        <Button onClick={onClose} variant="text">
          <Typography variant="body2" fontWeight="bold">
            {t("cancel")}
          </Typography>
        </Button>
        <LoadingButton
          loading={isBusy}
          onClick={handleDownload}
          disabled={disabled}
        >
          <Typography variant="body2" fontWeight="bold" color="inherit">
            {t("download")}
          </Typography>
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default DatsetDownloadModal;