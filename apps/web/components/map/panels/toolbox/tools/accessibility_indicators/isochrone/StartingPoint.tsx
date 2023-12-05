import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  debounce,
  useTheme,
  TextField,
  Button,
  Autocomplete,
} from "@mui/material";
import { useTranslation } from "@/i18n/client";
import { v4 } from "uuid";
import { useProjectLayers } from "@/lib/api/projects";
import { useMap } from "react-map-gl";
import { Icon, ICON_NAME } from "@p4b/ui/components/Icon";
import search from "@/lib/services/geocoder";
import { testForCoordinates } from "@/components/map/controls/Geocoder";
import { MAPBOX_TOKEN } from "@/lib/constants";
import { useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { addMarker, removeMarker } from "@/lib/store/map/slice";

import type { StartingPointType } from "@/types/map/isochrone";
import type { SelectChangeEvent } from "@mui/material";
import type { Result } from "@/types/map/controllers";
import type { FeatureCollection } from "geojson";
import type { RoutingTypes } from "@/types/map/isochrone";

interface PickLayerProps {
  routing: RoutingTypes | undefined;
  startingType: StartingPointType | undefined;
  setStartingType: (value: StartingPointType) => void;
  startingPoint: string[] | string;
  setStartingPoint: (value: string[] | string) => void;
}

const isochroneMarkerIcons = {
  walking: ICON_NAME.RUN,
  padelec: ICON_NAME.PEDELEC,
  bicycle: ICON_NAME.BICYCLE,
  pt: ICON_NAME.BUS,
  car_peak: ICON_NAME.CAR,
};

const StartingPoint = (props: PickLayerProps) => {
  const {
    routing,
    startingType,
    setStartingPoint,
    startingPoint,
    setStartingType,
  } = props;
  // const { projectLayers } = useProjectLayers();
  const { projectId } = useParams();
  const { layers: projectLayers } = useProjectLayers(
    typeof projectId === "string" ? projectId : "",
  );
  const [getCoordinates, setGetCoordinates] = useState<boolean>(false);
  const [value, setValue] = useState<Result | null>(null);
  const [options, setOptions] = useState<readonly Result[]>([]);
  const [inputValue, setInputValue] = useState("");

  const dispatch = useDispatch();
  const theme = useTheme();
  const { map } = useMap();
  const { t } = useTranslation("maps");

  const fetch = useMemo(
    () =>
      debounce(
        (
          request: { value: string; bbox: number[] },
          onresult: (_error: Error, fc: FeatureCollection) => void,
        ) => {
          search(
            "https://api.mapbox.com",
            "mapbox.places",
            MAPBOX_TOKEN,
            request.value,
            onresult,
            undefined,
            undefined,
            request.bbox,
          );
        },
        400,
      ),
    [],
  );

  useEffect(() => {
    const handleMapClick = (event) => {
      if (getCoordinates && typeof startingPoint !== "string") {
        startingPoint?.push(`${event.lngLat.lat},${event.lngLat.lng}`);
        setStartingPoint(startingPoint);
        dispatch(
          addMarker({
            id: `isochrone-${(startingPoint ? startingPoint?.length : 0) + 1}`,
            lat: event.lngLat.lat,
            long: event.lngLat.lng,
            iconName: isochroneMarkerIcons[routing ? routing : "walking"],
          }),
        );
      }
    };

    map.on("click", handleMapClick);

    return () => {
      map.off("click", handleMapClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getCoordinates, routing]);

  useEffect(() => {
    let active = true;
    if (inputValue === "") {
      setOptions(value ? [value] : []);
      return undefined;
    }
    const resultCoordinates = testForCoordinates(inputValue);
    if (resultCoordinates[0]) {
      const [_, latitude, longitude] = resultCoordinates;
      setOptions([
        {
          feature: {
            id: "",
            type: "Feature",
            place_type: ["coordinate"],
            relevance: 1,
            properties: {
              accuracy: "point",
            },
            text: "",
            place_name: "",
            center: [longitude, latitude],
            geometry: {
              type: "Point",
              coordinates: [longitude, latitude],
              interpolated: false,
            },
            address: "",
            context: [],
          },
          label: `${latitude}, ${longitude}`,
        },
      ]);
      return undefined;
    }

    const bbox = [
      map.getBounds().getSouthWest().toArray()[0],
      map.getBounds().getSouthWest().toArray()[1],
      map.getBounds().getNorthEast().toArray()[0],
      map.getBounds().getNorthEast().toArray()[1],
    ];

    fetch(
      { value: inputValue, bbox: bbox },
      (error: Error, fc: FeatureCollection) => {
        if (active) {
          if (!error && fc && fc.features) {
            setOptions(
              fc.features
                .map((feature) => ({
                  feature: feature,
                  label: feature.place_name,
                }))
                .filter((feature) => feature.label),
            );
          }
        }
      },
    );

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing(2),
        marginBottom: theme.spacing(4),
      }}
    >
      <Typography variant="body1" sx={{ color: "black" }}>
        {t("panels.isochrone.starting.starting")}
      </Typography>
      <Typography
        variant="body2"
        sx={{ fontStyle: "italic", marginBottom: theme.spacing(2) }}
      >
        {t("panels.isochrone.starting.starting_point_desc")}
      </Typography>
      <Box>
        <FormControl
          size="small"
          fullWidth
          sx={{
            margin: `${theme.spacing(1)} 0`,
          }}
        >
          <InputLabel id="demo-simple-select-label">
            {t("panels.isochrone.starting.type")}
          </InputLabel>
          <Select
            label={t("panels.isochrone.starting.type")}
            defaultValue="browse_layers"
            value={startingType ? startingType : ""}
            onChange={(event: SelectChangeEvent) => {
              setStartingType(event.target.value as StartingPointType);
              setStartingPoint([]);
              dispatch(removeMarker());
            }}
          >
            <MenuItem value="place_on_map">
              {t("panels.isochrone.starting.pick_on_map")}
            </MenuItem>
            <MenuItem value="browse_layers">
              {t("panels.isochrone.starting.pick_layer")}
            </MenuItem>
            <MenuItem value="address_input">
              {t("panels.isochrone.starting.search_address")}
            </MenuItem>
          </Select>
        </FormControl>
      </Box>
      {/* Pick layer in browse_layer */}
      {startingType === "browse_layers" ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: theme.spacing(2),
            marginBottom: theme.spacing(4),
          }}
        >
          <Typography variant="body1" sx={{ color: "black" }}>
            {t("panels.isochrone.starting.pick_layer")}
          </Typography>
          <Box>
            <FormControl
              size="small"
              fullWidth
              sx={{
                margin: `${theme.spacing(1)} 0`,
              }}
            >
              <InputLabel id="demo-simple-select-label">
                {t("panels.isochrone.starting.layer")}
              </InputLabel>
              <Select
                label={t("panels.isochrone.starting.layer")}
                value={startingPoint ? startingPoint : ""}
                onChange={(event: SelectChangeEvent) => {
                  setStartingPoint(event.target.value as string);
                }}
              >
                {projectLayers
                  ? projectLayers.map((layer) =>
                      layer.feature_layer_geometry_type === "point" ? (
                        <MenuItem value={layer.layer_id} key={v4()}>
                          {layer.name}
                        </MenuItem>
                      ) : null,
                    )
                  : null}
              </Select>
            </FormControl>
          </Box>
        </Box>
      ) : null}
      {/* select point on map in place_on_map */}
      {startingType === "place_on_map" ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: theme.spacing(2),
            marginBottom: theme.spacing(4),
          }}
        >
          <Typography variant="body1" sx={{ color: "black" }}>
            {t("panels.isochrone.starting.pick_on_map")}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: theme.spacing(2),
            }}
          >
            <TextField
              value={
                typeof startingPoint !== "string"
                  ? startingPoint?.join(";")
                  : ""
              }
              size="small"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setStartingPoint(event.target.value.split(";") as string[]);
              }}
              sx={{
                margin: `${theme.spacing(1)} 0`,
                width: "70%",
              }}
            />
            <Button
              variant={getCoordinates ? "contained" : "outlined"}
              size="large"
              onClick={() => {
                setGetCoordinates(!getCoordinates);
              }}
            >
              <Icon iconName={ICON_NAME.LOCATION} />
            </Button>
          </Box>
        </Box>
      ) : null}
      {/* Pick layer in address_search */}
      {startingType === "address_input" ? (
        <Box>
          <Typography variant="body1" sx={{ color: "black" }}>
            {t("panels.isochrone.starting.search_location")}
          </Typography>
          <Autocomplete
            disablePortal
            id="geocoder"
            size="small"
            filterOptions={(x) => x}
            options={options}
            fullWidth
            sx={{
              margin: `${theme.spacing(1)} 0`,
            }}
            onChange={(_event: unknown, newValue: Result | null) => {
              setOptions(newValue ? [newValue, ...options] : options);
              setStartingPoint(
                newValue?.feature.center
                  ? newValue?.feature.center
                      .reverse()
                      .map((coord) => coord.toString())
                  : [],
              );
              setValue(newValue);
            }}
            onInputChange={(_event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t("panels.isochrone.starting.search_address")}
                value={inputValue ? { label: inputValue } : { label: "" }}
              />
            )}
          />
        </Box>
      ) : null}
    </Box>
  );
};

export default StartingPoint;
