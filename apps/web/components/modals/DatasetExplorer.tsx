import ContentSearchBar from "@/components/dashboard/common/ContentSearchbar";
import FoldersTreeView from "@/components/dashboard/common/FoldersTreeView";
import TileGrid from "@/components/dashboard/common/TileGrid";
import { useTranslation } from "@/i18n/client";
import { useLayers } from "@/lib/api/layers";
import { addProjectLayers, useProjectLayers } from "@/lib/api/projects";
import type { GetLayersQueryParams, Layer } from "@/lib/validations/layer";
import type { Project } from "@/lib/validations/project";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";
import { useMap } from "react-map-gl";
import { zoomToLayer } from "@/lib/utils/map/navigate";

interface DatasetExplorerProps {
  open: boolean;
  onClose?: () => void;
  projectId: string;
}

const DatasetExplorerModal: React.FC<DatasetExplorerProps> = ({
  open,
  onClose,
  projectId,
}) => {
  const { t } = useTranslation("common");
  const [queryParams, setQueryParams] = useState<GetLayersQueryParams>({
    order: "descendent",
    order_by: "updated_at",
  });
  const {
    layers: datasets,
    isLoading: isDatasetLoading,
    isError: _isDatasetError,
  } = useLayers(queryParams);
  const [isBusy, setIsBusy] = useState(false);
  const { mutate: mutateProjectLayers } = useProjectLayers(projectId);

  const [selectedDataset, setSelectedDataset] = useState<Layer>();
  const { map } = useMap();

  const handleOnClose = () => {
    onClose && onClose();
  };
  const handleOnAdd = async () => {
    try {
      if (!selectedDataset) return;
      setIsBusy(true);
      await addProjectLayers(projectId, [selectedDataset.id]);
      mutateProjectLayers();
      if (map) {
        zoomToLayer(map, selectedDataset.extent);
      }
    } catch (error) {
      toast.error("Error adding layer");
    } finally {
      setIsBusy(false);
      handleOnClose();
    }
  };
  return (
    <>
      <Dialog open={open} onClose={handleOnClose} fullWidth maxWidth="md">
        <DialogTitle>Dataset Explorer</DialogTitle>
        <DialogContent>
          <Box sx={{ width: "100%" }}>
            <Grid container justifyContent="space-between" spacing={4}>
              <Grid item xs={4}>
                <Paper elevation={0} sx={{ backgroundImage: "none" }}>
                  <FoldersTreeView
                    queryParams={queryParams}
                    setQueryParams={setQueryParams}
                    enableActions={false}
                  />
                </Paper>
              </Grid>
              <Grid item xs={8}>
                <ContentSearchBar
                  contentType="layer"
                  view="list"
                  queryParams={queryParams}
                  setQueryParams={setQueryParams}
                />

                <TileGrid
                  view="list"
                  enableActions={false}
                  selected={selectedDataset}
                  onClick={(item: Project | Layer) => {
                    if (item.id === selectedDataset?.id) {
                      setSelectedDataset(undefined);
                    } else {
                      setSelectedDataset(item as Layer);
                    }
                  }}
                  items={datasets?.items ?? []}
                  isLoading={isDatasetLoading}
                  type="layer"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions
          disableSpacing
          sx={{
            pt: 6,
            pb: 2,
            justifyContent: "flex-end",
          }}
        >
          <Stack direction="row" spacing={2}>
            <Button onClick={handleOnClose} variant="text">
              <Typography variant="body2" fontWeight="bold">
                {t("cancel")}
              </Typography>
            </Button>
            <LoadingButton
              loading={isBusy}
              variant="contained"
              color="primary"
              onClick={handleOnAdd}
              disabled={!selectedDataset || isDatasetLoading}
            >
              Add Layer
            </LoadingButton>
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DatasetExplorerModal;
