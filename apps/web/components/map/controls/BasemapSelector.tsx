import { ArrowPopper } from "@/components/ArrowPoper";
import { ListTile } from "@/components/common/ListTile";
// import { makeStyles, useTheme } from "@/lib/theme";
import {
  Box,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  useTheme,
  Typography,
} from "@mui/material";
import Fab from "@mui/material/Fab";
import { useState } from "react";

import { Icon, ICON_NAME } from "@p4b/ui/components/Icon";
import { useMap } from "react-map-gl";

interface Item {
  value: string;
  url: string;
  title: string;
  subtitle: string;
  thumbnail: string;
  attributionComponent?: React.ReactNode;
}

interface BasemapSelectorProps {
  styles: Item[];
  active: number[];
  basemapChange: (styleIndex: number[]) => void;
}

export function BasemapSelector(props: BasemapSelectorProps) {
  const [open, setOpen] = useState(false);
  const { styles, active, basemapChange } = props;
  const theme = useTheme();
  const { map } = useMap();

  return (
    <>
      {map && (
        <Stack
          direction="column"
          sx={{
            alignItems: "flex-end",
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
          }}
        >
          <ArrowPopper
            placement="top-end"
            content={
              <Paper sx={{ width: 360, overflow: "auto" }}>
                <Box position="absolute" top={5} right={5}>
                  <IconButton onClick={() => setOpen(false)}>
                    <Icon
                      iconName={ICON_NAME.CLOSE}
                      htmlColor={theme.palette.text.secondary}
                      fontSize="small"
                    />
                  </IconButton>
                </Box>

                <Typography variant="body2" sx={{ margin: theme.spacing(3) }}>
                  Map Style
                </Typography>
                <ListTile
                  items={styles}
                  selected={active}
                  thumbnailBorder="rounded"
                  onChange={(selectedStyleIndex) => {
                    basemapChange(selectedStyleIndex);
                  }}
                />
              </Paper>
            }
            open={open}
            arrow={true}
            onClose={() => setOpen(false)}
          >
            <Tooltip title="Basemaps" arrow placement="left">
              <Fab
                onClick={() => setOpen(!open)}
                size="large"
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  color: theme.palette.secondary.light,
                  "&:hover": {
                    backgroundColor: theme.palette.background.default,
                  },
                }}
              >
                <Icon iconName={ICON_NAME.MAP} fontSize="small" />
              </Fab>
            </Tooltip>
          </ArrowPopper>
        </Stack>
      )}
    </>
  );
}