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
import { removeMarker } from "@/lib/store/map/slice";
import { ptModes, routingModes } from "@/public/assets/data/isochroneModes";

import type { SelectChangeEvent } from "@mui/material";
import type {
  UseFormRegister,
  UseFormGetValues,
  UseFormSetValue,
} from "react-hook-form";
import type { PostIsochrone } from "@/lib/validations/isochrone";
import type { PTModeTypes } from "@/types/map/isochrone";

interface PickLayerProps {
  register: UseFormRegister<PostIsochrone>;
  getValues: UseFormGetValues<PostIsochrone>;
  setValue: UseFormSetValue<PostIsochrone>;
  watch: PostIsochrone;
}

const IsochroneSettings = (props: PickLayerProps) => {
  const { register, watch, setValue } = props;

  const [tab, setTab] = useState<"time" | "distance">("time");

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
            options={allowedNumbers}
            value={
              watch.travel_cost.speed
                ? { label: watch.travel_cost.speed }
                : { label: 1 }
            }
            sx={{
              margin: `${theme.spacing(1)} 0`,
              width: "45%",
            }}
            disabled={!watch.routing_type}
            {...register("travel_cost.speed")}
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
    return "max_distance" in watch.travel_cost ? (
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
            {...register("travel_cost.max_distance")}
            size="small"
            disabled={!watch.routing_type ? true : false}
            type="number"
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
    ) : null;
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
          disabled={!watch.routing_type ? true : false}
          value={{ label: watch.travel_cost.max_traveltime }}
          options={allowedMaxTravelTimeNumbers}
          {...register("travel_cost.max_traveltime")}
          sx={{
            margin: `${theme.spacing(1)} 0`,
            width: "100%",
          }}
          renderInput={(params) => <TextField {...params} label="XX" />}
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
          disabled={
            !(
              watch.travel_cost.max_distance |
                watch.travel_cost.max_traveltime && watch.routing_type
            )
              ? true
              : false
          }
          {...register(
            watch.travel_cost.max_traveltime
              ? "travel_cost.traveltime_step"
              : "travel_cost.distance_step",
          )}
          size="small"
          fullWidth
          type="number"
          sx={{
            margin: `${theme.spacing(1)} 0`,
          }}
        />
      </Box>
    );
  }

  // useEffect(() => {
  //   if(watch.routing_type === "pt"){
  //     setValue("routing_type", )
  //   }
  // }, [])

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
          {t("panels.isochrone.routing.chose_routing")}
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
            value={
              typeof watch.routing_type === "string" ? watch.routing_type : "pt"
            }
            onChange={(event: SelectChangeEvent<string>) => {
              if (event.target.value === "pt") {
                setValue("routing_type", {
                  mode: [
                    "bus",
                    "tram",
                    "rail",
                    "subway",
                    "ferry",
                    "cable_car",
                    "gondola",
                    "funicular",
                  ],
                  egress_mode: "walk",
                  access_mode: "walk",
                });
              } else {
                setValue("routing_type", event.target.value);
              }
              dispatch(removeMarker());
            }}
          >
            {routingModes.map((modeRoute) => (
              <MenuItem key={v4()} value={modeRoute.value}>
                {t(`panels.isochrone.routing.modes.${modeRoute.name}`)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      {/*--------------------------PT Options--------------------------*/}
      {typeof watch.routing_type !== "string" ? (
        <Autocomplete
          multiple
          id="checkboxes-tags-demo"
          options={ptModes}
          disableCloseOnSelect
          defaultValue={ptModes.filter((mode) =>
            watch.routing_type.mode.includes(mode.value as PTModeTypes),
          )}
          getOptionLabel={(option) => option.name}
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox style={{ marginRight: 8 }} checked={selected} />
              {t(`panels.isochrone.routing.modes.${option.name}`)}
            </li>
          )}
          fullWidth
          {...register("routing_type.mode")}
          size="small"
          renderInput={(params) => (
            <TextField
              {...params}
              label={t("panels.isochrone.routing.pt_type")}
              placeholder={t("panels.isochrone.routing.pt_type")}
            />
          )}
        />
      ) : (
        <></>
      )}
      {/*--------------------------------------------------------------*/}
      <TabContext
        value={
          ["car_peak", "pt"].includes(
            typeof watch.routing_type === "string" ? watch.routing_type : "pt",
          )
            ? "time"
            : tab
        }
      >
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList
            onChange={(_: React.SyntheticEvent, newValue: string) => {
              setTab(newValue as "distance" | "time");
              setValue(
                "travel_cost",
                newValue === "distance"
                  ? {
                      max_distance: 50,
                      distance_step: 50,
                    }
                  : {
                      max_traveltime: 10,
                      traveltime_step: 50,
                      speed: 10,
                    },
              );
            }}
            variant="fullWidth"
          >
            <Tab
              label={t("panels.isochrone.time")}
              disabled={!watch.routing_type ? true : false}
              value="time"
            />
            <Tab
              label={t("panels.isochrone.distance")}
              disabled={
                !watch.routing_type ||
                ["car_peak", "pt"].includes(
                  typeof watch.routing_type === "string"
                    ? watch.routing_type
                    : "pt",
                )
                  ? true
                  : false
              }
              value="distance"
            />
          </TabList>
        </Box>
        <TabPanel value="time">
          {typeof watch.routing_type === "string" ? speedFunctionality() : null}
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
