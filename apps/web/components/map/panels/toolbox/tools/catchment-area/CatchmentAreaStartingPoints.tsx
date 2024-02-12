import { useAppDispatch, useAppSelector } from "@/hooks/store/ContextHooks";
import { setToolboxStartingPoints } from "@/lib/store/map/slice";
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

const CatchmentAreaStartingPoints = () => {
  const { map } = useMap();
  const theme = useTheme();
  const { t } = useTranslation("maps");
  const dispatch = useAppDispatch();
  const startingPoints = useAppSelector(
    (state) => state.map.toolboxStartingPoints,
  );

  const handleZoomToStartingPoint = (coordinate: [number, number]) => {
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
            <TableCell align="center">
              <Typography variant="caption" fontWeight="bold">
                Lon
              </Typography>
            </TableCell>
            <TableCell align="center">
              <Typography variant="caption" fontWeight="bold">
                Lat
              </Typography>
            </TableCell>
            <TableCell align="right"> </TableCell>
          </TableRow>
        </TableHead>
      </Table>
      <TableContainer style={{marginTop: 0, maxHeight: 250}}>
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

export default CatchmentAreaStartingPoints;
