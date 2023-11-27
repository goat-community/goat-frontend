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
  Checkbox,
} from "@mui/material";
import { TabContext, TabPanel, TabList } from "@mui/lab";
import { useTranslation } from "@/i18n/client";
import { v4 } from "uuid";
import { useDispatch } from "react-redux";
import { removeMarker } from "@/lib/store/styling/slice";
import { ptModes, routingModes } from "@/public/assets/data/isochroneModes";

import type { SelectChangeEvent } from "@mui/material";
import type { RoutingTypes, PTModeTypes } from "@/types/map/isochrone";

interface PickLayerProps {
  routing: RoutingTypes | undefined;
  setRouting: (value: RoutingTypes) => void;
  ptModes: PTModeTypes[] | undefined;
  setPtModes: (value: PTModeTypes[]) => void;
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
    ptModes: getPtModes,
    setPtModes,
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

  const [ptOpen, setPtOpen] = useState<boolean>(false);

  const { t } = useTranslation("maps");
  const theme = useTheme();

  const dispatch = useDispatch();

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
            value={speed ? speed : ""}
            sx={{
              margin: `${theme.spacing(1)} 0`,
              width: "45%",
            }}
            onChange={(_, value) => {
              setSpeed(value ? value.label : 1);
            }}
            renderInput={(params) => <TextField {...params} label="XX" />}
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
            value={distance ? distance : ""}
            error={distance ? distance % 50 !== 0 || distance > 20000 : false}
            helperText={
              distance && (distance % 50 !== 0 || distance > 20000)
                ? "Invalid distance value"
                : ""
            }
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
          value={travelTime ? travelTime : ""}
          options={allowedMaxTravelTimeNumbers}
          onChange={(_, value) => {
            setTravelTime(value ? value.label : 1);
          }}
          sx={{
            margin: `${theme.spacing(1)} 0`,
            width: "100%",
          }}
          renderInput={(params) => (
            <TextField {...params} label="XX"  />
          )}
        />
      </Box>
    );
  }

  function stepFunctionality() {
    const isValidStep = steps
      ? steps % 5 !== 0 || steps > (travelTime ? travelTime : 0)
      : false;

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
          value={steps ? steps : ""}
          error={isValidStep}
          helperText={isValidStep ? "Invalid step value" : ""}
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
        <Typography
          variant="body2"
          sx={{ fontStyle: "italic", marginBottom: theme.spacing(2) }}
        >
          Chose a routing type for the isochrone.
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
            defaultValue={routing}
            value={routing ? routing : ""}
            onChange={(event: SelectChangeEvent<string>) => {
              if (event.target.value === "pt") {
                setPtOpen(true);
              } else {
                setPtOpen(false);
              }
              setRouting(event.target.value as RoutingTypes);
              dispatch(removeMarker());
            }}
          >
            {routingModes.map((modeRoute) => (
              <MenuItem key={v4()} value={modeRoute.value}>
                {/* {modeRoute.name} */}
                {t(`panels.isochrone.routing.modes.${modeRoute.name}`)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      {/*--------------------------PT Options--------------------------*/}
      {ptOpen ? (
        <Autocomplete
          multiple
          id="checkboxes-tags-demo"
          options={ptModes}
          disableCloseOnSelect
          getOptionLabel={(option) => option.name}
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox style={{ marginRight: 8 }} checked={selected} />
              {t(`panels.isochrone.routing.modes.${option.name}`)}
            </li>
          )}
          fullWidth
          size="small"
          renderInput={(params) => (
            <TextField
              {...params}
              label={t("panels.isochrone.routing.pt_type")}
              placeholder={t("panels.isochrone.routing.pt_type")}
            />
          )}
          onChange={(_, value) => {
            // setPtModes(value.map((val) => val.value).join(","));
            setPtModes(value.map((val) => val.value) as PTModeTypes[]);
          }}
        />
      ) : null}
      {/*--------------------------------------------------------------*/}
      <TabContext value={ptOpen || routing === "car_peak" ? "time" : tab}>
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
              disabled={
                !routing || ptOpen || routing === "car_peak" ? true : false
              }
              value="distance"
            />
          </TabList>
        </Box>
        <TabPanel value="time">
          {routing !== ("pt" as RoutingTypes) ? speedFunctionality() : null}
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
