import { Fab, Stack, Tooltip, useTheme } from "@mui/material";
import { Icon, ICON_NAME } from "@p4b/ui/components/Icon";
import { useMap } from "react-map-gl";

type ZoomProps = {
  tooltipZoomIn?: string;
  tooltipZoomOut?: string;
};

export function Zoom(props: ZoomProps) {
  const { map } = useMap();
  const theme = useTheme();

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
            <Tooltip title={props.tooltipZoomIn || "Zoom In"} arrow placement="left">
              <Fab
                onClick={() => map?.zoomIn()}
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
                  iconName={ICON_NAME.PLUS}
                  htmlColor="inherit"
                  fontSize="small"
                />
              </Fab>
            </Tooltip>
            <Tooltip title={props.tooltipZoomOut || "Zoom Out"} arrow placement="left">
              <Fab
                onClick={() => map?.zoomOut()}
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
                  iconName={ICON_NAME.MINUS}
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
