import Container from "@/components/map/panels/Container";
import {
  Button,
  Typography,
  Tab,
  Tabs,
  useTheme,
  Box,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useDispatch } from "react-redux";

import { useTranslation } from "@/i18n/client";
import { setActiveRightPanel } from "@/lib/store/map/slice";
import { useState } from "react";
import ProjectLayerDropdown from "@/components/map/panels/ProjectLayerDropdown";
import { useActiveLayer } from "@/hooks/map/LayerPanelHooks";
import Marker from "@/components/map/panels/mapStyle/Marker";

interface MapStyleProps {
  projectId: string;
}

const MapStylePanel = ({ projectId }: MapStyleProps) => {
  const theme = useTheme();
  const { t } = useTranslation(["maps", "common"]);
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState(0);
  const activeLayer = useActiveLayer(projectId);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

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
              rowGap: "24px",
            }}
          >
            <Box>
              <Tabs
                value={tabValue}
                aria-label="layer style"
                onChange={handleChange}
              >
                <Tab
                  label={t("panels.layer_design.simple")}
                  sx={{
                    width: "50%",
                  }}
                />
                <Tab
                  label={t("panels.layer_design.smart")}
                  sx={{
                    width: "50%",
                  }}
                />
              </Tabs>
            </Box>
            {tabValue === 0 ? (
              <>
                <Marker />
                {/* <Card>
                <CardMedia
                  sx={{
                    height: "42px",
                    backgroundColor: theme.palette.secondary.main,
                    border: "none",
                  }}
                  component="div"
                /> 
                <CardContent
                  sx={{
                    display: "flex",
                    columnGap: "6px",
                    padding: "8px 16px",
                  }}
                >
                  <IconButton type="submit" sx={{ alignSelf: "flex-start" }}>
                    <Icon iconName={ICON_NAME.CIRCLEINFO} fontSize="small" />
                  </IconButton>
                  <Typography variant="body2" color="text.secondary">
                    Location (single symbol)
                  </Typography>
                  <Checkbox />
                </CardContent>
              </Card> */}
                {/* {mapLayer?.type === "line" ? (
                <>
                  <ColorOptionLine />
                  <Divider
                    sx={{
                      width: "100%",
                      borderTop: "none",
                      borderBottom: `1px solid ${theme.palette.primary.main}`,
                    }}
                  />
                  <StrokeOptionLine />
                </>
              ) : null}
              {mapLayer?.type === "fill" ? (
                <>
                  <ColorOptionFill />
                  <Divider
                    sx={{
                      width: "100%",
                      borderTop: "none",
                      borderBottom: `1px solid ${theme.palette.primary.main}`,
                    }}
                  />
                  <SelectStrokeOptionFill />
                </>
              ) : null}
              {mapLayer?.type === "symbol" ? (
                <>
                  <MarkerOptionSymbol />
                  <Divider
                    sx={{
                      width: "100%",
                      borderTop: "none",
                      borderBottom: `1px solid ${theme.palette.primary.main}`,
                    }}
                  />
                  <ColorOptionSymbol />
                  <Divider
                    sx={{
                      width: "100%",
                      borderTop: "none",
                      borderBottom: `1px solid ${theme.palette.primary.main}`,
                    }}
                  />
                  <StrokeOptionSymbol />
                  <Divider
                    sx={{
                      width: "100%",
                      borderTop: "none",
                      borderBottom: `1px solid ${theme.palette.primary.main}`,
                    }}
                  />
                  <SizeOptionSymbol />
                </>
              ) : null} */}
              </>
            ) : (
              <>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    rowGap: "8px",
                    width: "100%",
                  }}
                >
                  <Typography variant="body2">
                    {t("panels.layer_design.field")}
                  </Typography>
                  <Typography
                    color="secondary"
                    variant="caption"
                    sx={{
                      fontStyle: "italic",
                      paddingBottom: theme.spacing(2),
                    }}
                  >
                    {t("panels.layer_design.select_field")}
                  </Typography>
                  <FormControl fullWidth size="small">
                    <InputLabel id="demo-simple-select-label">
                      {t("panels.layer_design.select_option")}
                    </InputLabel>
                    {/* <Select label={t("panels.layer_design.select_option")}>
                      {layerTypes.map((type) => (
                        <MenuItem key={v4()} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select> */}
                  </FormControl>
                </Box>
                <Box>
                  {/* <Typography
                  color="secondary"
                  variant="subtitle2"
                  sx={{
                    fontStyle: "italic",
                    margin: "0 8px",
                  }}
                >
                  Style your map according to the values of a specific attribute
                  or column in the dataset, using techniques such as color
                  coding or symbol size variation for categorical and numerical
                  data.
                </Typography> */}
                </Box>
              </>
            )}
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
