import EmptyCard from "@/components/dashboard/common/EmptyCard";
import TileCard from "@/components/dashboard/common/TileCard";
import ContentDialogWrapper from "@/components/modals/ContentDialogWrapper";
import DatasetUploadModal from "@/components/modals/DatasetUpload";
import { useContentMoreMenu } from "@/hooks/dashboard/ContentHooks";
import type { Layer } from "@/lib/validations/layer";
import type { ContentActions } from "@/types/common";
import {
  Box,
  Button,
  Divider,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import { ICON_NAME, Icon } from "@p4b/ui/components/Icon";
import { useState } from "react";

interface DataSectionProps {
  layers: Layer[];
  isLoading: boolean;
}

const DataSection = (props: DataSectionProps) => {
  const { layers, isLoading } = props;

  const {
    moreMenuOptions,
    activeContent,
    moreMenuState,
    closeMoreMenu,
    openMoreMenu,
  } = useContentMoreMenu();

  const [openDatasetUploadModal, setOpenDatasetUploadModal] = useState(false);
  return (
    <Box>
      <DatasetUploadModal
        open={openDatasetUploadModal}
        onClose={() => setOpenDatasetUploadModal(false)}
      />
      {activeContent && moreMenuState && (
        <>
          <ContentDialogWrapper
            content={activeContent}
            action={moreMenuState.id as ContentActions}
            onClose={closeMoreMenu}
            onContentDelete={closeMoreMenu}
            type="layer"
          />
        </>
      )}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6">Recent Datasets</Typography>
        <Button
          variant="text"
          size="small"
          endIcon={
            <Icon iconName={ICON_NAME.CHEVRON_RIGHT} style={{ fontSize: 12 }} />
          }
          href="/datasets"
          sx={{
            borderRadius: 0,
          }}
        >
          See All
        </Button>
      </Box>
      <Divider sx={{ mb: 4 }} />
      <Grid container spacing={5}>
        {(isLoading ? Array.from(new Array(4)) : layers ?? []).map(
          (item: Layer, index: number) => (
            <Grid
              item
              key={item?.id ?? index}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              display={{
                sm: index > 3 ? "none" : "block",
                md: index > 2 ? "none" : "block",
                lg: index > 3 ? "none" : "block",
              }}
            >
              {!item ? (
                <Skeleton variant="rectangular" height={200} />
              ) : (
                <TileCard
                  cardType="grid"
                  item={item}
                  moreMenuOptions={moreMenuOptions}
                  onMoreMenuSelect={openMoreMenu}
                />
              )}
            </Grid>
          ),
        )}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          {isLoading ? (
            <Skeleton variant="rectangular" height={200} />
          ) : (
            <EmptyCard
              onClick={() => setOpenDatasetUploadModal(true)}
              tooltip="Add new dataset"
              backgroundImage="https://assets.plan4better.de/img/grid_thumbnail.png"
            />
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default DataSection;
