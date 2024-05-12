"use client";

import {
  Box,
  Button,
  Container,
  Grid,
  Pagination,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { ICON_NAME, Icon } from "@p4b/ui/components/Icon";
import { useState } from "react";
import { useLayers } from "@/lib/api/layers";
import TileGrid from "@/components/dashboard/common/TileGrid";
import FoldersTreeView from "@/components/dashboard/common/FoldersTreeView";
import ContentSearchBar from "@/components/dashboard/common/ContentSearchbar";
import DatasetUploadModal from "@/components/modals/DatasetUpload";
import { useTranslation } from "@/i18n/client";
import { useJobStatus } from "@/hooks/jobs/JobStatus";
import type { PaginatedQueryParams } from "@/lib/validations/common";
import type { GetDatasetSchema } from "@/lib/validations/layer";
import { useRouter } from "next/navigation";

const Datasets = () => {
  const router = useRouter();
  const { t } = useTranslation("common");
  const [queryParams, setQueryParams] = useState<PaginatedQueryParams>({
    order: "descendent",
    order_by: "updated_at",
    size: 10,
    page: 1,
  });
  const [datasetSchema, setDatasetSchema] = useState<GetDatasetSchema>({});
  const [view, setView] = useState<"list" | "grid">("grid");
  const [openDatasetUploadModal, setOpenDatasetUploadModal] = useState(false);

  const {
    mutate,
    layers: datasets,
    isLoading: isDatasetLoading,
    isError: _isDatasetError,
  } = useLayers(queryParams, datasetSchema);

  useJobStatus(mutate);

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
        <Typography variant="h6">{t("datasets")}</Typography>
        <Button
          disableElevation={true}
          startIcon={
            <Icon iconName={ICON_NAME.PLUS} style={{ fontSize: 12 }} />
          }
          onClick={() => setOpenDatasetUploadModal(true)}
        >
          {t("add_dataset")}
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
            datasetSchema={datasetSchema}
            setDatasetSchema={setDatasetSchema}
          />
        </Grid>
        <Grid item xs={3}>
          <Paper elevation={3} sx={{ backgroundImage: "none" }}>
            <FoldersTreeView
              queryParams={datasetSchema}
              setQueryParams={setDatasetSchema}
            />
          </Paper>
        </Grid>
        <Grid item xs={9}>
          <TileGrid
            view={view}
            items={datasets?.items ?? []}
            isLoading={isDatasetLoading || !datasetSchema.folder_id}
            type="layer"
            onClick={(item) => {
              if (item && item.id) {
                router.push(`/datasets/${item.id}`);
              }
            }}
          />
          {!isDatasetLoading && datasets && datasets?.items.length > 0 && (
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              sx={{ p: 4 }}
            >
              <Pagination
                count={datasets.pages || 1}
                size="large"
                page={queryParams.page || 1}
                onChange={(_e, page) => {
                  setQueryParams({
                    ...queryParams,
                    page,
                  });
                }}
              />
            </Stack>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Datasets;
