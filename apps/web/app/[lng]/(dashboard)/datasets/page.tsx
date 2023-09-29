"use client";

import { Box, Button, Container, Grid, Paper, Typography } from "@mui/material";
import { ICON_NAME, Icon } from "@p4b/ui/components/Icon";
import { useState } from "react";
import { useLayers } from "@/lib/api/layers";
import TileGrid from "@/components/dashboard/common/TileGrid";
import FoldersTreeView from "@/components/dashboard/common/FoldersTreeView";
import type { GetLayersQueryParams } from "@/lib/validations/layer";
import ContentSearchBar from "@/components/dashboard/common/ContentSearchbar";
import DatasetUploadModal from "@/components/modals/DatasetUpload";

const Datasets = () => {
  const [queryParams, setQueryParams] = useState<GetLayersQueryParams>({
    order: "descendent",
    order_by: "updated_at",
  });
  const [view, setView] = useState<"list" | "grid">("grid");
  const [openDatasetUploadModal, setOpenDatasetUploadModal] = useState(false);

  const {
    layers: datasets,
    isLoading: isDatasetLoading,
    isError: _isDatasetError,
  } = useLayers(queryParams);

  return (
    <Container sx={{ py: 10, px: 10 }} maxWidth="xl">
      <DatasetUploadModal
        open={openDatasetUploadModal}
        onClose={() => setOpenDatasetUploadModal(false)}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 8,
        }}
      >
        <Typography variant="h6">Datasets</Typography>
        <Button
          disableElevation={true}
          startIcon={
            <Icon iconName={ICON_NAME.PLUS} style={{ fontSize: 12 }} />
          }
          onClick={() => setOpenDatasetUploadModal(true)}
        >
          Add Dataset
        </Button>
      </Box>
      <Grid container justifyContent="space-between" spacing={4}>
        <Grid item xs={12}>
          <ContentSearchBar
            contentType="layer"
            view={view}
            setView={setView}
            queryParams={queryParams}
            setQueryParams={setQueryParams}
          />
        </Grid>
        <Grid item xs={3}>
          <Paper elevation={3} sx={{ backgroundImage: "none" }}>
            <FoldersTreeView
              queryParams={queryParams}
              setQueryParams={setQueryParams}
            />
          </Paper>
        </Grid>
        <Grid item xs={9}>
          <TileGrid
            view={view}
            items={datasets?.items ?? []}
            isLoading={isDatasetLoading}
            type="layer"
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Datasets;
