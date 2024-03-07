"use client";

// import { useTranslation } from "@/i18n/client";
import { useDataset } from "@/lib/api/layers";
import { Box, Button, Container, Typography } from "@mui/material";
import { ICON_NAME, Icon } from "@p4b/ui/components/Icon";
import { useRouter } from "next/navigation";

export default function DatasetDetailPage({ params: { datasetId } }) {
  // const { t } = useTranslation("maps");
  const router = useRouter();
  const { dataset, isLoading } = useDataset(datasetId);
  console.log(dataset);
  console.log(isLoading);
  return (
    <Container sx={{ py: 10, px: 10 }} maxWidth="xl">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 8,
        }}
      >
        <Button
          variant="text"
          startIcon={
            <Icon iconName={ICON_NAME.CHEVRON_LEFT} style={{ fontSize: 12 }} />
          }
          sx={{
            borderRadius: 0,
          }}
          onClick={() => router.back()}
        >
          <Typography variant="body2" color="inherit">
            Data Catalog
          </Typography>
        </Button>
      </Box>
    </Container>
  );
}
