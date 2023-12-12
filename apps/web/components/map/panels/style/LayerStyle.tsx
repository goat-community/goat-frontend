import Container from "@/components/map/panels/Container";
import {
  Button,
  Typography,
  useTheme,
  Box,
  Stack,
  Switch,
  IconButton,
  Divider,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { useTranslation } from "@/i18n/client";
import { setActiveRightPanel } from "@/lib/store/map/slice";
import ProjectLayerDropdown from "@/components/map/panels/ProjectLayerDropdown";
import { useActiveLayer } from "@/hooks/map/LayerPanelHooks";
import { ICON_NAME, Icon } from "@p4b/ui/components/Icon";
import ColorPicker from "@/components/map/panels/style/ColorPicker";

const MapStylePanel = ({ projectId }: { projectId: string }) => {
  const theme = useTheme();
  const { t } = useTranslation(["maps", "common"]);
  const dispatch = useDispatch();
  const activeLayer = useActiveLayer(projectId);

  return (
    <Container
      title="Layer Style"
      disablePadding={true}
      close={() => dispatch(setActiveRightPanel(undefined))}
      body={
        <>
          {activeLayer && (
            <ProjectLayerDropdown
              projectId={projectId}
              layerTypes={["feature"]}
            />
          )}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* {Fill Color} */}
            <Stack>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Stack direction="row" alignItems="center">
                  <Icon
                    iconName={ICON_NAME.CIRCLE}
                    style={{ fontSize: "17px" }}
                    color="inherit"
                  />
                  <Typography variant="body2" fontWeight="bold" sx={{ pl: 2 }}>
                    Fill Color
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center">
                  <Switch defaultChecked size="small" />
                  <IconButton>
                    <Icon
                      iconName={ICON_NAME.SLIDERS}
                      style={{ fontSize: "15px" }}
                    />
                  </IconButton>
                </Stack>
              </Stack>
              <Stack direction="row" alignItems="center" sx={{ pl: 2 }}>
                <Divider
                  orientation="vertical"
                  sx={{ borderRightWidth: "2px", my: -4 }}
                />
                <Stack sx={{ pl: 4, py: 4 }}>
                  <ColorPicker selectedColor="#ff0000" onChange={() => {}} />
                </Stack>
              </Stack>
            </Stack>
          </Box>
        </>
      }
      action={
        <Box
          sx={{
            minWidth: "266px",
            display: "flex",
            columnGap: "16px",
          }}
        >
          <Button
            sx={{
              borderRadius: "24px",
              textTransform: "none",
              fontSize: "14px",
              width: "50%",
              "&:disabled": {
                border: "1px solid #ccc",
                color: theme.palette.secondary.dark,
              },
            }}
            color="error"
            variant="outlined"
          >
            <Typography variant="body2" fontWeight="bold" color="inherit">
              {t("common:reset")}
            </Typography>
          </Button>
          <Button
            sx={{
              borderRadius: "24px",
              textTransform: "none",
              fontSize: "14px",
              width: "50%",
              "&:disabled": {
                border: "1px solid #ccc",
                color: theme.palette.secondary.dark,
              },
            }}
            color="primary"
            size="small"
            variant="outlined"
          >
            <Typography variant="body2" fontWeight="bold" color="inherit">
              {t("common:save")}
            </Typography>
          </Button>
        </Box>
      }
    />
  );
};

export default MapStylePanel;
