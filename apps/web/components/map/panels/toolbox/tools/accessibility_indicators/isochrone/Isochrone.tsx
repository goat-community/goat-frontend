import React, { useState, useMemo } from "react";
import { Box, Button, useTheme, Typography } from "@mui/material";
import IsochroneSettings from "@/components/map/panels/toolbox/tools/accessibility_indicators/isochrone/IsochroneSettings";
import StartingPoint from "@/components/map/panels/toolbox/tools/accessibility_indicators/isochrone/StartingPoint";
import { useTranslation } from "@/i18n/client";
import SaveResult from "@/components/map/panels/toolbox/tools/SaveResult";
// import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import {
  SendPTIsochroneRequest,
  SendCarIsochroneRequest,
  SendIsochroneRequest,
} from "@/lib/api/isochrone";

import type { StartingPointType } from "@/types/map/isochrone";
import type { PostIsochrone } from "@/lib/validations/isochrone";

const Isochrone = () => {
  // Isochrone Settings states
  // const [routing, setRouting] = useState<RoutingTypes | undefined>(undefined);
  // const [ptModes, setPtModes] = useState<PTModeTypes[] | undefined>([
  //   "bus",
  //   "tram",
  //   "rail",
  //   "subway",
  //   "ferry",
  //   "cable_car",
  //   "gondola",
  //   "funicular",
  // ]);
  // const [speed, setSpeed] = useState<number | undefined>(undefined);
  // const [distance, setDistance] = useState<number | undefined>(undefined);
  // const [travelTime, setTravelTime] = useState<number | undefined>(undefined);
  // const [steps, setSteps] = useState<number | undefined>(undefined);

  // Sarting point states
  const [startingType, setStartingType] = useState<
    StartingPointType | undefined
  >(undefined);
  // const [startingPoint, setStartingPoint] = useState<string[] | string>([]);

  // Save Result states
  // const [outputName, setOutputName] = useState<string>(`isochrone`);
  // const [folderSaveID, setFolderSaveID] = useState<string | undefined>(
  //   undefined,
  // );

  const theme = useTheme();
  const { t } = useTranslation("maps");
  // const dispatch = useDispatch();

  const {
    register,
    reset,
    watch,
    getValues,
    setValue,
    // formState: { errors },
  } = useForm<PostIsochrone>({
    defaultValues: {
      routing_type: "",
      starting_points: {
        latitude: [],
        longitude: [],
      },
      travel_cost: {
        max_traveltime: 10,
        traveltime_step: 50,
        speed: 10,
      },
      time_window: undefined,
      result_target: {
        layer_name: "isochrone",
        folder_id: "",
        project_id: undefined,
      },
    },
  });

  const watchFormValues = watch();

  const handleReset = () => {
    reset();
  };

  const handleRun = () => {
    console.log("body of the request: ", getValues());

    if (typeof watchFormValues.routing_type !== "string") {
      setValue("time_window", {
        weekday: "weekday",
        from_time: 25200,
        to_time: 32400,
      });
      SendPTIsochroneRequest(getValues());
    } else if (watchFormValues.routing_type === "car_peak") {
      SendCarIsochroneRequest(getValues());
    } else {
      SendIsochroneRequest(getValues());
    }
    // }
  };

  const getCurrentValues = useMemo(() => {
    return watchFormValues;
  }, [watchFormValues]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      sx={{ height: "100%" }}
    >
      <Box sx={{ maxHeight: "95%", overflow: "scroll" }}>
        <Typography
          variant="body2"
          sx={{ fontStyle: "italic", marginBottom: theme.spacing(4) }}
        >
          {t("panels.isochrone.isochrone_description")}
        </Typography>
        <IsochroneSettings
          register={register}
          getValues={getValues}
          watch={getCurrentValues}
          setValue={setValue}
        />
        {getCurrentValues.routing_type ? (
          <StartingPoint
            register={register}
            setValue={setValue}
            watch={getCurrentValues}
            startingType={startingType}
            setStartingType={setStartingType}
          />
        ) : null}
        {startingType &&
        ("layer_id" in getCurrentValues.starting_points ||
          "latitude" in getCurrentValues.starting_points) ? (
          <SaveResult
            register={register}
            // setValue={setValue}
            watch={getCurrentValues}
          />
        ) : null}
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: theme.spacing(2),
          alignItems: "center",
        }}
      >
        <Button variant="outlined" sx={{ flexGrow: "1" }} onClick={handleReset}>
          {t("panels.tools.reset")}
        </Button>
        <Button sx={{ flexGrow: "1" }} onClick={handleRun}>
          {t("panels.tools.run")}
        </Button>
      </Box>
    </Box>
  );
};

export default Isochrone;
