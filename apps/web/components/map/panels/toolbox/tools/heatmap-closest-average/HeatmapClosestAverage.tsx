import Container from "@/components/map/panels/Container";
import ToolsHeader from "@/components/map/panels/toolbox/common/ToolsHeader";
import { useTranslation } from "@/i18n/client";
import type { IndicatorBaseProps } from "@/types/map/toolbox";
import { Box, Typography, useTheme } from "@mui/material";

const HeatmapClosestAverage = ({ onBack, onClose }: IndicatorBaseProps) => {
  const { t } = useTranslation("common");
  const theme = useTheme();

  return (
    <Container
      disablePadding={false}
      header={
        <ToolsHeader onBack={onBack} title={t("heatmap_closest_average")} />
      }
      close={onClose}
      body={
        <>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="body2"
              sx={{ fontStyle: "italic", marginBottom: theme.spacing(4) }}
            >
              {t("heatmap_closest_average_description")}
            </Typography>
          </Box>
        </>
      }
    />
  );
};

export default HeatmapClosestAverage;
