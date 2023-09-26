import Container from "@/components/map/panels/Container";

import { ICON_NAME, Icon } from "@p4b/ui/components/Icon";
import { Card, IconButton, Stack, Typography, useTheme } from "@mui/material";
import type { LayerProps, SourceProps } from "@/types/map/layers";
import type { MapSidebarItem } from "../Sidebar";

interface PanelProps {
  onCollapse?: () => void;
  layers?: (SourceProps & LayerProps)[];
  setActiveLeft: (item: MapSidebarItem | undefined) => void;
}

const LayerPanel = ({ layers, setActiveLeft }: PanelProps) => {
  const theme = useTheme();

  return (
    <Container
      title="Layers"
      close={setActiveLeft}
      direction="left"
      body={
        <>
          {layers?.map((layer) => (
            <Card
              key={layer.id}
              sx={{
                boxShadow:
                  "0px 1px 10px 0px rgba(0, 0, 0, 0.06), 0px 2px 2px 0px rgba(0, 0, 0, 0.07), 0px 1px 2px -1px rgba(0, 0, 0, 0.10)",
                borderRadius: 0,
                ":hover": {
                  boxShadow:
                    "0px 1px 10px 0px rgba(0, 0, 0, 0.12), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 2px 4px -1px rgba(0, 0, 0, 0.20)",
                },
                cursor: "pointer",
                padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
                margin: theme.spacing(1),
              }}
              variant="outlined"
            >
              <Stack
                spacing={1}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography noWrap variant="body2">
                  {layer.name}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <IconButton
                    type="button"
                    size="small"
                    sx={{
                      padding: theme.spacing(1),
                    }}
                  >
                    <Icon
                      iconName={
                        layer.active ? ICON_NAME.EYE : ICON_NAME.EYE_SLASH
                      }
                      fontSize="small"
                      sx={{
                        color: theme.palette.text.secondary,
                        margin: theme.spacing(2),
                        "&:hover": {
                          color: theme.palette.primary.main,
                        },
                      }}
                    />
                  </IconButton>
                </Stack>
              </Stack>
            </Card>
          ))}
        </>
      }
    />
  );
};

export default LayerPanel;
