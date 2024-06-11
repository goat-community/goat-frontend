import Selector from "@/components/map/panels/common/Selector";
import type { SelectorItem } from "@/types/map/common";
import { useAppDispatch, useAppSelector } from "@/hooks/store/ContextHooks";
import { useEffect } from "react";
import { useMap } from "react-map-gl";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import {
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { ICON_NAME, Icon } from "@p4b/ui/components/Icon";
import { useTranslation } from "@/i18n/client";
import { v4 } from "uuid";
import { setIsMapGetInfoActive, setMapCursor, setToolboxStartingPoints } from "@/lib/store/map/slice";
import { useLayerByGeomType } from "@/hooks/map/ToolsHooks";
import { useParams } from "next/navigation";

const StartingPoints = () => {
  const { map } = useMap();
  const theme = useTheme();
  const { t } = useTranslation("common");
  const dispatch = useAppDispatch();
  const startingPoints = useAppSelector(
    (state) => state.map.toolboxStartingPoints,
  );

  const handleZoomToStartingPoint = (coordinate: [number, number]) => {
    if (!map) return;
    map.flyTo({ center: coordinate, zoom: 16 });
  };

  const handleDeleteStartingPoint = (index: number) => {
    if (!startingPoints?.length) return;
    const newStartingPoints = startingPoints.filter((_, i) => i !== index);
    dispatch(setToolboxStartingPoints(undefined));
    dispatch(setToolboxStartingPoints(newStartingPoints));
  };

  useEffect(() => {
    const handleMapClick = (event) => {
      const coordinate = [event.lngLat.lng, event.lngLat.lat] as [
        number,
        number,
      ];
      dispatch(setToolboxStartingPoints([coordinate]));
    };
    if (!map) return;
    map.on("click", handleMapClick);
    return () => {
      map.off("click", handleMapClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Table size="small" aria-label="starting point table" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell align="left">
              <Typography variant="caption" fontWeight="bold">
                Lon
              </Typography>
            </TableCell>
            <TableCell align="left">
              <Typography variant="caption" fontWeight="bold">
                Lat
              </Typography>
            </TableCell>
            <TableCell align="right"> </TableCell>
          </TableRow>
        </TableHead>
      </Table>
      {/* { Second table as workaround to make the table body scrollable} */}
      <TableContainer style={{ marginTop: 0, maxHeight: 250 }}>
        <Table size="small" aria-label="starting point table">
          <TableBody>
            {!startingPoints?.length && (
              <TableRow>
                <TableCell align="center" colSpan={3}>
                  <Typography variant="caption" fontWeight="bold">
                    {t("no_starting_points_added")}
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {!startingPoints
              ? null
              : startingPoints.map((point, index) => (
                  <TableRow key={v4()}>
                    <TableCell align="center" sx={{ px: 2 }}>
                      <Typography variant="caption" fontWeight="bold">
                        {point[0].toFixed(4)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center" sx={{ px: 2 }}>
                      <Typography variant="caption" fontWeight="bold">
                        {point[1].toFixed(4)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ px: 2 }}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="end"
                        spacing={1}
                      >
                        <Tooltip
                          title={t("zoom_to_starting_point")}
                          placement="top"
                        >
                          <IconButton
                            size="small"
                            onClick={() => handleZoomToStartingPoint(point)}
                            sx={{
                              "&:hover": {
                                color: theme.palette.primary.main,
                              },
                            }}
                          >
                            <Icon
                              iconName={ICON_NAME.ZOOM_IN}
                              style={{ fontSize: "12px" }}
                              htmlColor="inherit"
                            />
                          </IconButton>
                        </Tooltip>
                        <Tooltip
                          title={t("delete_starting_point")}
                          placement="top"
                        >
                          <IconButton
                            size="small"
                            sx={{
                              "&:hover": {
                                color: theme.palette.error.main,
                              },
                            }}
                            onClick={() => handleDeleteStartingPoint(index)}
                          >
                            <Icon
                              iconName={ICON_NAME.TRASH}
                              style={{ fontSize: "12px" }}
                              htmlColor="inherit"
                            />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

interface StartingPointOptionsProps {
  isActive: boolean;
  startingPointMethod: SelectorItem;
  setStartingPointMethod: (item: SelectorItem) => void;
  startingPointMethods: SelectorItem[];
  startingPointLayer: SelectorItem | undefined;
  setStartingPointLayer: (item: SelectorItem | undefined) => void;
}

const StartingPointSelectors: React.FC<StartingPointOptionsProps> = ({
  isActive,
  startingPointMethod,
  setStartingPointMethod,
  startingPointMethods,
  startingPointLayer,
  setStartingPointLayer,
}) => {
  const dispatch = useAppDispatch();
  const { projectId } = useParams();
  const { t } = useTranslation("common");
  const { filteredLayers } = useLayerByGeomType(
    ["feature"],
    ["point"],
    projectId as string,
  );


  useEffect(() => {
    if (isActive && startingPointMethod.value === "map") {
      dispatch(setIsMapGetInfoActive(false));
      dispatch(setMapCursor("crosshair"));
    } else {
      dispatch(setIsMapGetInfoActive(true));
      dispatch(setMapCursor(undefined));
    }

  }, [dispatch, isActive, startingPointMethod.value])


  return (
    <>
      <Selector
        selectedItems={startingPointMethod}
        setSelectedItems={(item: SelectorItem[] | SelectorItem | undefined) => {
          dispatch(setToolboxStartingPoints(undefined));
          setStartingPointLayer(undefined);
          setStartingPointMethod(item as SelectorItem);
        }}
        items={startingPointMethods}
        label={t("select_starting_point_method")}
        placeholder={t("select_starting_point_method_placeholder")}
        tooltip={t("select_starting_point_method_tooltip")}
      />

      {startingPointMethod.value === "browser_layer" && isActive && (
        <Selector
          selectedItems={startingPointLayer}
          setSelectedItems={(
            item: SelectorItem[] | SelectorItem | undefined,
          ) => {
            setStartingPointLayer(item as SelectorItem);
          }}
          items={filteredLayers}
          emptyMessage={t("no_point_layer_found")}
          emptyMessageIcon={ICON_NAME.LAYERS}
          label={t("select_point_layer")}
          placeholder={t("select_point_layer_placeholder")}
          tooltip={t("select_point_layer_tooltip")}
        />
      )}

      {startingPointMethod.value === "map" && isActive && <StartingPoints />}
    </>
  );
};

export default StartingPointSelectors;
