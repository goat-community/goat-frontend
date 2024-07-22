"use client";

import { Box, Button, Container, Paper, Skeleton, Tab, Tabs, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { ICON_NAME, Icon } from "@p4b/ui/components/Icon";

import { useTranslation } from "@/i18n/client";

import { useDataset } from "@/lib/api/layers";

import DatasetMapPreview from "@/components/dashboard/dataset/DatasetMapPreview";
import DatasetSummary from "@/components/dashboard/dataset/DatasetSummary";
import DatasetTable from "@/components/dashboard/dataset/DatasetTable";

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dataset-tabpanel-${index}`}
      aria-labelledby={`dataset-tab-${index}`}
      {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function DatasetDetailPage({ params: { datasetId } }) {
  const router = useRouter();
  const { t } = useTranslation("common");
  const { dataset, isLoading } = useDataset(datasetId);
  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const tabItems = useMemo(() => {
    const dataItems = [
      { label: t("summary"), value: 0 },
      { label: t("data"), value: 1 },
    ];
    if (dataset?.type !== "table") {
      dataItems.push({ label: t("map"), value: 2 });
    }

    return dataItems;
  }, [dataset?.type, t]);

  return (
    <Container sx={{ py: 10, px: 10 }} maxWidth="xl">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 8,
        }}>
        <Button
          variant="text"
          startIcon={<Icon iconName={ICON_NAME.CHEVRON_LEFT} style={{ fontSize: 12 }} />}
          sx={{
            borderRadius: 0,
          }}
          onClick={() => router.back()}>
          <Typography variant="body2" color="inherit">
            {t("back")}
          </Typography>
        </Button>
      </Box>
      {isLoading && <Skeleton variant="rectangular" width="100%" height={600} />}
      {!isLoading && dataset && (
        <Box>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h6" fontWeight="bold">
              {dataset.name}
            </Typography>
            <Box sx={{ width: "100%", mt: 8 }}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs value={value} scrollButtons onChange={handleChange}>
                  {tabItems.map((item) => (
                    <Tab key={item.value} label={item.label} {...a11yProps(item.value)} />
                  ))}
                </Tabs>
              </Box>
              {tabItems.map((item) => (
                <CustomTabPanel key={item.value} value={value} index={item.value}>
                  {item.value === 0 && <DatasetSummary dataset={dataset} />}
                  {item.value === 1 && <DatasetTable dataset={dataset} />}
                  {item.value === 2 && <DatasetMapPreview dataset={dataset} />}
                </CustomTabPanel>
              ))}
            </Box>
          </Paper>
        </Box>
      )}
    </Container>
  );
}
