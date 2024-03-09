import { useTranslation } from "@/i18n/client";
import { fitBounds } from "@/lib/utils/map/navigate";
import { wktToGeoJSON } from "@/lib/utils/map/wkt";
import { Fab, Stack, Tooltip, useTheme } from "@mui/material";
import { Icon, ICON_NAME } from "@p4b/ui/components/Icon";
import bbox from "@turf/bbox";
import { useMap } from "react-map-gl";

type RecenterProps = {
  initialExtent: string;
};

export function Recenter({ initialExtent }: RecenterProps) {
  const theme = useTheme();
  const { map } = useMap();
  const { t } = useTranslation(["maps"]);
  const recenter = () => {
    if (map) {
      const geojson = wktToGeoJSON(initialExtent);
      const boundingBox = bbox(geojson);
      fitBounds(map, boundingBox as [number, number, number, number], 10, 21);
    }
  };

  return (
    <>
      {map && (
        <>
          <Stack
            direction="column"
            sx={{
              alignItems: "flex-end",
              marginTop: theme.spacing(1),
              marginBottom: theme.spacing(1),
            }}
          >
            <Tooltip title={t("recenter_map")} arrow placement="right">
              <Fab
                onClick={() => recenter()}
                size="small"
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  marginTop: theme.spacing(1),
                  marginBottom: theme.spacing(1),
                  color: theme.palette.text.secondary,
                  "&:hover": {
                    backgroundColor: theme.palette.background.default,
                  },
                }}
              >
                <Icon
                  iconName={ICON_NAME.MINIMIZE}
                  htmlColor="inherit"
                  fontSize="small"
                />
              </Fab>
            </Tooltip>
          </Stack>
        </>
      )}
    </>
  );
}
