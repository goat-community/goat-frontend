import React, { useState } from "react";
import {
  Typography,
  useTheme,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  TextField,
  Tab,
  Autocomplete,
} from "@mui/material";
import { TabContext, TabPanel, TabList } from "@mui/lab";
import { useTranslation } from "@/i18n/client";
import { v4 } from "uuid";

import type { SelectChangeEvent } from "@mui/material";
import type { RoutingTypes } from "@/types/map/isochrone";

interface PickLayerProps {
  routing: RoutingTypes | undefined;
  setRouting: (value: RoutingTypes) => void;
  speed: number | undefined;
  setSpeed: (value: number) => void;
  distance: number | undefined;
  setDistance: (value: number) => void;
  travelTime: number | undefined;
  setTravelTime: (value: number) => void;
  steps: number | undefined;
  setSteps: (value: number) => void;
}

const IsochroneSettings = (props: PickLayerProps) => {
  const {
    routing,
    setRouting,
    speed,
    setSpeed,
    distance,
    setDistance,
    travelTime,
    setTravelTime,
    steps,
    setSteps,
  } = props;
  const [tab, setTab] = useState<"time" | "distance">("time");

  const { t } = useTranslation("maps");
  const theme = useTheme();

  const routingModes = [
    {
      name: t("panels.isochrone.routing.modes.bus"),
      value: "bus",
    },
    {
      name: t("panels.isochrone.routing.modes.tram"),
      value: "tram",
    },
    {
      name: t("panels.isochrone.routing.modes.rail"),
      value: "rail",
    },
    {
      name: t("panels.isochrone.routing.modes.subway"),
      value: "subway",
    },
    {
      name: t("panels.isochrone.routing.modes.ferry"),
      value: "ferry",
    },
    {
      name: t("panels.isochrone.routing.modes.cable_car"),
      value: "cable_car",
    },
    {
      name: t("panels.isochrone.routing.modes.gondola"),
      value: "gondola",
    },
    {
      name: t("panels.isochrone.routing.modes.funicular"),
      value: "funicular",
    },
    {
      name: t("panels.isochrone.routing.modes.walk"),
      value: "walk",
    },
    {
      name: t("panels.isochrone.routing.modes.bicycle"),
      value: "bicycle",
    },
    {
      name: t("panels.isochrone.routing.modes.car"),
      value: "car",
    },
  ];

  const allowedNumbers = [
    ...Array.from({ length: 25 }, (_, index) => index + 1).map((label) => ({
      label: label,
    })),
  ];

  const allowedMaxTravelTimeNumbers = [
    ...Array.from({ length: 45 }, (_, index) => index + 1).map((label) => ({
      label: label,
    })),
  ];

  function speedFunctionality() {
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
          {t("panels.isochrone.speed")}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            size="small"
            disabled={!routing ? true : false}
            options={allowedNumbers}
            sx={{
              margin: `${theme.spacing(1)} 0`,
              width: "45%",
            }}
            onChange={(_, value) => {
              setSpeed(value ? value.label : 1);
            }}
            renderInput={(params) => (
              <TextField {...params} label="XX" value={speed} />
            )}
          />
          <FormControl
            size="small"
            sx={{
              margin: `${theme.spacing(1)} 0`,
              width: "45%",
            }}
          >
            <InputLabel id="demo-simple-select-label">
              {t("panels.isochrone.unity")}
            </InputLabel>
            <Select
              disabled
              label={t("panels.isochrone.unity")}
              defaultValue="Km/h"
            >
              <MenuItem value="Km/h">Km/h</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
    );
  }

  function distanceFunctionality() {
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
          {t("panels.isochrone.distance")}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <TextField
            label="XX"
            value={distance}
            error={distance ? (distance % 50 !== 0 || distance > 20000) : false}
            size="small"
            disabled={!routing ? true : false}
            type="number"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setDistance(parseInt(event.target.value) as number);
            }}
            sx={{
              margin: `${theme.spacing(1)} 0`,
              width: "45%",
            }}
          />
          <FormControl
            size="small"
            sx={{
              margin: `${theme.spacing(1)} 0`,
              width: "45%",
            }}
          >
            <InputLabel id="demo-simple-select-label">
              {t("panels.isochrone.unity")}
            </InputLabel>
            <Select
              disabled
              label={t("panels.isochrone.unity")}
              defaultValue="m"
            >
              <MenuItem value="m">m</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
    );
  }

  function travelTimeFunctionality() {
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
          {t("panels.isochrone.travelTime")}
        </Typography>
        <Autocomplete
          fullWidth
          disablePortal
          id="combo-box-demo"
          size="small"
          disabled={!routing ? true : false}
          options={allowedMaxTravelTimeNumbers}
          onChange={(_, value) => {
            setTravelTime(value ? value.label : 1);
          }}
          sx={{
            margin: `${theme.spacing(1)} 0`,
            width: "100%",
          }}
          renderInput={(params) => (
            <TextField {...params} label="XX" value={travelTime} />
          )}
        />
      </Box>
    );
  }

  function stepFunctionality() {
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
          {t("panels.isochrone.steps")}
        </Typography>
        <TextField
          label="XX"
          value={steps}
          error={steps ? steps % 50 !== 0 : false}
          size="small"
          disabled={!routing ? true : false}
          fullWidth
          type="number"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setSteps(parseInt(event.target.value) as number);
          }}
          sx={{
            margin: `${theme.spacing(1)} 0`,
          }}
        />
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: theme.spacing(2),
          marginBottom: theme.spacing(4),
        }}
      >
        <Typography variant="body1" sx={{ color: "black" }}>
          {t("panels.isochrone.routing.routing")}
        </Typography>
        <FormControl
          fullWidth
          size="small"
          sx={{
            margin: `${theme.spacing(1)} 0`,
          }}
        >
          <InputLabel id="demo-simple-select-label">
            {t("panels.filter.select_attribute")}
          </InputLabel>
          <Select
            label={t("panels.filter.select_attribute")}
            defaultValue={routing ? routing : ""}
            onChange={(event: SelectChangeEvent<string>) =>
              setRouting(event.target.value as RoutingTypes)
            }
          >
            {routingModes.map((modeRoute) => (
              <MenuItem key={v4()} value={modeRoute.value}>
                {modeRoute.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      {/*--------------------------------------------------------------*/}
      <TabContext value={tab}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList
            onChange={(_: React.SyntheticEvent, newValue: string) => {
              setTab(newValue as "distance" | "time");
              // ["distance", "time"].includes(newValue) ? newValue : "time"
            }}
            aria-label="lab API tabs example"
            variant="fullWidth"
          >
            <Tab label="Time" disabled={!routing ? true : false} value="time" />
            <Tab
              label="Distance"
              disabled={!routing ? true : false}
              value="distance"
            />
          </TabList>
        </Box>
        <TabPanel value="time">
          {speedFunctionality()}
          {travelTimeFunctionality()}
          {stepFunctionality()}
        </TabPanel>
        <TabPanel value="distance">
          {distanceFunctionality()}
          {stepFunctionality()}
        </TabPanel>
      </TabContext>
    </>
  );
};

export default IsochroneSettings;
