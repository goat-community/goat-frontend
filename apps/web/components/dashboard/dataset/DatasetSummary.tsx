import { METADATA_HEADER_ICONS } from "@/components/dashboard/catalog/CatalogDatasetCard";
import { useGetMetadataValueTranslation } from "@/hooks/map/DatasetHooks";
import { useTranslation } from "@/i18n/client";
import { datasetMetadataAggregated, type Layer } from "@/lib/validations/layer";
import type { ProjectLayer } from "@/lib/validations/project";
import { Grid, Stack, Typography, useTheme } from "@mui/material";
import { Icon } from "@p4b/ui/components/Icon";
import React from "react";

interface DatasetSummaryProps {
  dataset: ProjectLayer | Layer;
}

const DatasetSummary: React.FC<DatasetSummaryProps> = ({ dataset }) => {
  const theme = useTheme();
  const { t, i18n } = useTranslation(["common", "countries"]);
  const getMetadataValueTranslation = useGetMetadataValueTranslation();

  return (
    <>
      <Grid container justifyContent="flex-start" spacing={4}>
        <Grid item xs={12} sm={12} md={8} lg={9}>
          {!dataset.description && (
            <Typography variant="body2" sx={{ fontStyle: "italic" }}>
              {t("common:no_description")}
            </Typography>
          )}
          {dataset.description && (
            <Typography>{dataset.description}</Typography>
          )}
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={3} sx={{ pl: 0 }}>
          <Stack spacing={4}>
            {Object.keys(datasetMetadataAggregated.shape).map((key) => {
              return (
                <Stack
                  key={key}
                  width="100%"
                  alignItems="start"
                  justifyContent="start"
                >
                  <Typography variant="caption">
                    {i18n.exists(`maps:metadata.headings.${key}`)
                      ? t(`maps:metadata.headings.${key}`)
                      : key}
                  </Typography>
                  <Stack
                    spacing={2}
                    alignItems="center"
                    justifyContent="start"
                    direction="row"
                  >
                    <Icon
                      iconName={METADATA_HEADER_ICONS[key]}
                      style={{ fontSize: 14 }}
                      htmlColor={theme.palette.text.secondary}
                    />
                    <Typography variant="body2" fontWeight="bold">
                      {getMetadataValueTranslation(key, dataset[key])}
                    </Typography>
                  </Stack>
                </Stack>
              );
            })}
          </Stack>
        </Grid>
      </Grid>
    </>
  );
};

export default DatasetSummary;
