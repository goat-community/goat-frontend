import { Fab, Stack, Tooltip, useTheme } from "@mui/material";
import { Icon, ICON_NAME } from "@p4b/ui/components/Icon";
import { useMap } from "react-map-gl";
import { useState } from "react";
import screenfull from "screenfull";

export function Fullscren() {
  const [fullscreen, setFullscreen] = useState(screenfull.isFullscreen);

  const theme = useTheme();

  const { map } = useMap();
  if (screenfull.isEnabled) {
    screenfull.on("change", () => {
      setFullscreen(screenfull.isFullscreen);
    });
  }
  const toggleFullscreen = () => {
    if (screenfull.isEnabled) {
      screenfull.toggle();
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
            <Tooltip
              title={fullscreen ? "Exit Fullscreen" : "Fullscreen"}
              arrow
              placement="left"
            >
              <Fab
                onClick={() => toggleFullscreen()}
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
                  iconName={
                    fullscreen ? ICON_NAME.MINIMIZE : ICON_NAME.MAXIMIZE
                  }
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
