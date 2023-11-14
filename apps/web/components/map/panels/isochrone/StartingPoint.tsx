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
import { useProjectLayers } from "@/hooks/map/layersHooks";
import { useMap } from "react-map-gl";
import { Icon, ICON_NAME } from "@p4b/ui/components/Icon";
import search from "@/lib/services/geocoder";
import { testForCoordinates } from "@/components/map/controls/Geocoder";
import { MAPBOX_TOKEN } from "@/lib/constants";

import type { StartingPointType } from "@/types/map/isochrone";
import type { SelectChangeEvent } from "@mui/material";
import type { Result } from "@/types/map/controllers";
import type { FeatureCollection } from "geojson";

interface PickLayerProps {
  startingType: StartingPointType | undefined;
  setStartingType: (value: StartingPointType) => void;
  startingPoint: string | undefined;
  setStartingPoint: (value: string) => void;
}

const StartingPoint = (props: PickLayerProps) => {
  const { startingType, setStartingPoint, startingPoint, setStartingType } =
    props;
  const { projectLayers } = useProjectLayers();
  const [getCoordinates, setGetCoordinates] = useState<boolean>(false);
  const [value, setValue] = useState<Result | null>(null);
  const [options, setOptions] = useState<readonly Result[]>([]);
  const [inputValue, setInputValue] = useState("");
  // const [focused, setFocused] = useState(false);
  // const [collapsed, setCollapsed] = useState(true);

  const theme = useTheme();
  const { map } = useMap();
  const { t } = useTranslation("maps");

  const fetch = useMemo(
    () =>
      debounce(
        (
          request: { value: string },
          onresult: (_error: Error, fc: FeatureCollection) => void,
        ) => {
          search(
            "https://api.mapbox.com", //endpoint,
            "mapbox.places", //source,
            MAPBOX_TOKEN,
            request.value,
            onresult,
            // proximity,
            // country,
            // bbox,
            // types,
            // limit,
            // autocomplete,
            // language,
          );
        },
        400,
      ),
    [],
  );

  useEffect(() => {
    if (getCoordinates) {
      map.on("click", (event) => {
        setStartingPoint(`${event.lngLat.lat},${event.lngLat.lng}`);
        setGetCoordinates(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getCoordinates]);

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
    fetch({ value: inputValue }, (error: Error, fc: FeatureCollection) => {
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
    });

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
            value={startingType}
            onChange={(event: SelectChangeEvent) =>
              setStartingType(event.target.value as StartingPointType)
            }
          >
            <MenuItem value="place_on_map">Place on map</MenuItem>
            <MenuItem value="browse_layers">Browse layers</MenuItem>
            <MenuItem value="address_input">Address input</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {/* Pick layer in browse_layer */}
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
              value={startingPoint}
              onChange={(event: SelectChangeEvent) =>
                setStartingPoint(event.target.value as string)
              }
            >
              {projectLayers.map((layer) =>
                layer.feature_layer_geometry_type === "point" ? (
                  <MenuItem value={layer.id} key={v4()}>
                    {layer.name}
                  </MenuItem>
                ) : null,
              )}
            </Select>
          </FormControl>
        </Box>
      </Box>
      {/* select point on map in place_on_map */}
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
            // label={t("panels.isochrone.starting.origin")}
            value={startingPoint}
            error={startingPoint ? !startingPoint?.includes(",") : false}
            size="small"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setStartingPoint(event.target.value as string);
            }}
            sx={{
              margin: `${theme.spacing(1)} 0`,
              width: "70%",
            }}
          />
          <Button
            variant={getCoordinates ? "contained" : "outlined"}
            size="large"
            onClick={() => setGetCoordinates(!getCoordinates)}
          >
            <Icon iconName={ICON_NAME.LOCATION} />
          </Button>
        </Box>
      </Box>
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
            setValue(newValue);
          }}
          onInputChange={(_event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label={t("panels.isochrone.starting.search_address")}
            />
          )}
        />
      </Box>
    </Box>
  );
};

export default StartingPoint;
