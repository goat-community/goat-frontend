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
  Chip,
  Divider,
  Stack,
} from "@mui/material";
import { TabContext, TabPanel, TabList } from "@mui/lab";
import { useTranslation } from "@/i18n/client";
import { v4 } from "uuid";
import { useDispatch } from "react-redux";
import { removeMarker } from "@/lib/store/map/slice";
import { ptModes, routingModes } from "@/public/assets/data/isochroneModes";
import { Icon, ICON_NAME } from "@p4b/ui/components/Icon";

import type { SelectChangeEvent } from "@mui/material";
import type {
  UseFormRegister,
  UseFormGetValues,
  UseFormSetValue,
  FieldErrors,
} from "react-hook-form";
import type { PostIsochrone } from "@/lib/validations/isochrone";
import type { PTModeTypes } from "@/types/map/isochrone";

interface PickLayerProps {
  register: UseFormRegister<PostIsochrone>;
  getValues: UseFormGetValues<PostIsochrone>;
  setValue: UseFormSetValue<PostIsochrone>;
  watch: PostIsochrone;
  errors: FieldErrors<PostIsochrone>;
}

const IsochroneSettings = (props: PickLayerProps) => {
  const { register, watch, setValue, errors } = props;

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
          margin: `${theme.spacing(4)} 0`,
        }}
      >
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
            fullWidth
            disabled={!watch.routing_type}
            onChange={(
              _: unknown,
              newValue: {
                label: number;
              },
            ) => {
              setValue("travel_cost.speed", newValue.label);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                error={!!errors.travel_cost?.speed}
                helperText={
                  !!errors.travel_cost?.speed &&
                  errors.travel_cost?.speed?.message
                }
                label={`${t("panels.isochrone.speed")} (Km/h)`}
              />
            )}
          />
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
          margin: `${theme.spacing(4)} 0`,
        }}
      >
        <TextField
          label={`${t("panels.isochrone.distance")} (m)`}
          {...register("travel_cost.max_distance", {
            valueAsNumber: true,
            setValueAs: (value) => (value === "" ? undefined : parseInt(value)),
          })}
          size="small"
          disabled={!watch.routing_type ? true : false}
          error={
            !!errors.travel_cost &&
            "max_distance" in errors.travel_cost &&
            !!errors.travel_cost.max_distance
          }
          // helperText={
          //   !!errors.travel_cost &&
          //   "max_distance" in errors.travel_cost &&
          //   errors.travel_cost.max_distance.message
          // }
          type="number"
          sx={{
            margin: `${theme.spacing(1)} 0`,
          }}
          fullWidth
        />
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
          margin: `${
            typeof watch.routing_type !== "string"
              ? theme.spacing(4)
              : `${theme.spacing(4)} 0 ${theme.spacing(4)}`
          } 0`,
        }}
      >
        <Autocomplete
          fullWidth
          disablePortal
          id="combo-box-demo"
          size="small"
          disabled={!watch.routing_type ? true : false}
          value={{
            label:
              "max_traveltime" in watch.travel_cost &&
              watch.travel_cost.max_traveltime,
          }}
          options={allowedMaxTravelTimeNumbers}
          onChange={(
            _: unknown,
            newValue: {
              label: number;
            },
          ) => {
            setValue("travel_cost.max_traveltime", newValue.label);
          }}
          sx={{
            margin: `${theme.spacing(1)} 0`,
            width: "100%",
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              // error={!!errors.travel_cost?.max_traveltime}
              // helperText={errors.travel_cost?.max_traveltime?.message}
              label={`${t("panels.isochrone.travelTime")} (min)`}
            />
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
          // marginBottom: theme.spacing(4),
        }}
      >
        <TextField
          label={t("panels.isochrone.steps")}
          disabled={
            !(
              ("max_distance" in watch.travel_cost &&
                watch.travel_cost.max_distance) ||
              ("max_traveltime" in watch.travel_cost &&
                watch.travel_cost.max_traveltime &&
                watch.routing_type)
            )
              ? true
              : false
          }
          {...register(
            "max_distance" in watch.travel_cost &&
              watch.travel_cost.max_distance
              ? "travel_cost.distance_step"
              : "travel_cost.traveltime_step",
            {
              valueAsNumber: true,
              setValueAs: (value) =>
                value === "" ? undefined : parseInt(value),
            },
          )}
          // error={
          //   "distance_step" in watch.travel_cost
          //     ? !!errors.travel_cost?.distance_step
          //     : !!errors.travel_cost?.traveltime_step
          // }
          // helperText={
          //   "distance_step" in watch.travel_cost
          //     ? errors.travel_cost?.distance_step?.message
          //     : errors.travel_cost?.traveltime_step?.message
          // }
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
        <Typography
          variant="body2"
          sx={{ fontStyle: "italic", marginBottom: theme.spacing(4) }}
        >
          {t("panels.isochrone.isochrone_description")}
        </Typography>
        <Typography
          variant="body1"
          fontWeight="bold"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: theme.spacing(2),
          }}
        >
          <Icon
            iconName={ICON_NAME.BUS}
            htmlColor={theme.palette.grey[700]}
            fontSize="small"
          />
          {t("panels.isochrone.routing.routing")}
        </Typography>
        <Stack direction="row" alignItems="center" sx={{ pl: 2 }}>
          <Divider orientation="vertical" sx={{ borderRightWidth: "2px" }} />
          <Box sx={{ pl: 4, py: 4, pr: 1 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: theme.spacing(2),
              }}
            >
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
                    typeof watch.routing_type === "string"
                      ? watch.routing_type
                      : "pt"
                  }
                  error={!!errors.routing_type}
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
                  typeof watch.routing_type !== "string" &&
                  "mode" in watch.routing_type
                    ? watch.routing_type.mode.includes(
                        mode.value as PTModeTypes,
                      )
                    : "",
                )}
                getOptionLabel={(option) => option.name}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox style={{ marginRight: 8 }} checked={selected} />
                    {t(`panels.isochrone.routing.modes.${option.name}`)}
                  </li>
                )}
                renderTags={
                  (value, getTagProps) => (
                    <>
                      {value.slice(0, 2).map((option, index) => (
                        <Chip
                          label={option.name}
                          {...getTagProps({ index })}
                          key={index}
                        />
                      ))}
                      {value.length > 2 ? <Chip label="..." /> : null}
                    </>
                  )
                  // </Stack>
                }
                fullWidth
                {...register("routing_type.mode")}
                size="small"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    // error={!!errors.routing_type?.mode}
                    // helperText={errors.routing_type?.mode?.message}
                    label={t("panels.isochrone.routing.pt_type")}
                    placeholder={
                      typeof watch.routing_type !== "string" &&
                      "mode" in watch.routing_type &&
                      watch.routing_type.mode.length
                        ? undefined
                        : t("panels.isochrone.routing.pt_type")
                    }
                  />
                )}
                sx={{
                  mt: 4
                }}
              />
            ) : (
              <></>
            )}
          </Box>
        </Stack>
      </Box>
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: theme.spacing(2),
          }}
        >
          <Typography
            variant="body1"
            fontWeight="bold"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: theme.spacing(2),
            }}
          >
            <Icon
              iconName={ICON_NAME.SLIDERS}
              htmlColor={theme.palette.grey[700]}
              sx={{ fontSize: "16px" }}
            />
            Configuration
          </Typography>
        </Box>
        <Stack direction="row" alignItems="center" sx={{ pl: 2, mb: 3 }}>
          <Divider orientation="vertical" sx={{ borderRightWidth: "2px" }} />
          <Stack sx={{ pl: 4, py: 4, pr: 1 }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Typography
                variant="body2"
                sx={{ fontStyle: "italic", marginBottom: theme.spacing(2) }}
              >
                {t("panels.isochrone.routing.chose_routing")}
              </Typography>
              <TabList
                onChange={(_: React.SyntheticEvent, newValue: string) => {
                  setTab(newValue as "distance" | "time");
                  setValue(
                    "travel_cost",
                    newValue === "distance"
                      ? {
                          max_distance: 0,
                          distance_step: 0,
                        }
                      : {
                          max_traveltime: 0,
                          traveltime_step: 0,
                          speed: 0,
                        },
                  );
                }}
                variant="fullWidth"
              >
                <Tab
                  label={
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: theme.spacing(2),
                      }}
                      color={
                        tab !== "time" ? theme.palette.grey[400] : undefined
                      }
                    >
                      <Icon iconName={ICON_NAME.CLOCK} fontSize="small" />{" "}
                      {t("panels.isochrone.time")}
                    </Typography>
                  }
                  disabled={!watch.routing_type ? true : false}
                  value="time"
                />
                <Tab
                  label={
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: theme.spacing(2),
                      }}
                      color={
                        tab !== "distance" ? theme.palette.grey[400] : undefined
                      }
                    >
                      <Icon
                        iconName={ICON_NAME.MAP_LOCATION}
                        fontSize="small"
                      />{" "}
                      {t("panels.isochrone.distance")}
                    </Typography>
                  }
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
            <TabPanel
              value="time"
              sx={{
                padding: "0",
              }}
            >
              {typeof watch.routing_type === "string"
                ? speedFunctionality()
                : null}
              {travelTimeFunctionality()}
              {stepFunctionality()}
            </TabPanel>
            <TabPanel value="distance" sx={{ padding: "0" }}>
              {distanceFunctionality()}
              {stepFunctionality()}
            </TabPanel>
          </Stack>
        </Stack>
      </TabContext>
    </>
  );
};

export default IsochroneSettings;
