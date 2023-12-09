import React, { useState, useMemo } from "react";
import { Box, Button, useTheme, Typography } from "@mui/material";
import IsochroneSettings from "@/components/map/panels/toolbox/tools/accessibility_indicators/isochrone/IsochroneSettings";
import StartingPoint from "@/components/map/panels/toolbox/tools/accessibility_indicators/isochrone/StartingPoint";
import { useTranslation } from "@/i18n/client";
import SaveResult from "@/components/map/panels/toolbox/tools/SaveResult";
import {
  SendIsochroneRequest,
  SendPTIsochroneRequest,
  SendCarIsochroneRequest,
} from "@/lib/api/isochrone";
import { useDispatch } from "react-redux";
import { removeMarker } from "@/lib/store/map/slice";
import { useForm, useWatch } from "react-hook-form";

import type { StartingPointType } from "@/types/map/isochrone";
import type { RoutingTypes, PTModeTypes } from "@/types/map/isochrone";
import type { StartingPointType as StartingPointTypeForm } from "@/lib/validations/isochrone";
import type {
  PostIsochrone,
  PostPTIsochrone,
} from "@/lib/validations/isochrone";

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
  const [startingPoint, setStartingPoint] = useState<string[] | string>([]);

  // Save Result states
  // const [outputName, setOutputName] = useState<string>(`isochrone`);
  // const [folderSaveID, setFolderSaveID] = useState<string | undefined>(
  //   undefined,
  // );

  const theme = useTheme();
  const { t } = useTranslation("maps");
  const dispatch = useDispatch();

  const {
    // handleSubmit,
    register,
    reset,
    watch,
    getValues,
    setValue,
    // formState: { errors },
    control,
  } = useForm<PostIsochrone>({
    defaultValues: {
      routing_type: "",
      starting_points: {
        latitude: [],
        longitude: [],
      },
      travel_cost: {
        max_traveltime: 10,
        traveltime_step: 10,
        speed: 10,
      },
      time_window: undefined,
      // {
      //     weekday: z.string(),
      //     from_time: z.number(),
      //     to_time: z.number(),
      //   },
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
    // setRouting(undefined);
    // setSpeed(undefined);
    // setDistance(undefined);
    // setTravelTime(undefined);
    // setSteps(undefined);
    // setOutputName(`isochrone`);
    // setFolderSaveID(undefined);
    // setStartingType(undefined);
    // setStartingPoint([]);
    // dispatch(removeMarker());

  };

  // const getStartingPoint = (): StartingPointTypeForm => {
  //   switch (startingType) {
  //     case "place_on_map":
  //       return {
  //         latitude: [
  //           ...(typeof startingPoint !== "string"
  //             ? startingPoint.map((startPoint) =>
  //                 parseFloat(startPoint.split(",")[0]),
  //               )
  //             : []),
  //         ],
  //         longitude: [
  //           ...(typeof startingPoint !== "string"
  //             ? startingPoint.map((startPoint) =>
  //                 parseFloat(startPoint.split(",")[1]),
  //               )
  //             : []),
  //         ],
  //       };
  //     case "address_input":
  //       return {
  //         latitude: [parseFloat(startingPoint[1])],
  //         longitude: [parseFloat(startingPoint[0])],
  //       };
  //     case "browse_layers":
  //       return {
  //         layer_id: startingPoint === "string" ? startingPoint : "",
  //       };
  //     // never gonna happen, but just to remove the linting issue
  //     default:
  //       return {
  //         layer_id: "",
  //       };
  //   }
  // };

  const handleRun = () => {
    console.log("body of the request: ", getValues());
    // if (
    //   routing &&
    //   startingPoint &&
    //   startingPoint.length &&
    //   startingType &&
    //   steps &&
    //   outputName &&
    //   folderSaveID
    // ) {
    //   const isochroneBody: PostIsochrone | PostPTIsochrone = {
    //     starting_points: getStartingPoint(),
    //     result_target: {
    //       layer_name: outputName,
    //       folder_id: folderSaveID,
    //     },
    //     travel_cost: distance
    //       ? {
    //           max_distance: distance,
    //           distance_step: steps,
    //         }
    //       : {
    //           max_traveltime: travelTime ? travelTime : 10,
    //           traveltime_step: steps,
    //           speed: speed ?? undefined,
    //         },
    //     ...(routing === "pt"
    //       ? {
    //           routing_type: {
    //             mode: ptModes as string[],
    //             egress_mode: "walk",
    //             access_mode: "walk",
    //           },
    //           time_window: {
    //             weekday: "weekday",
    //             from_time: 25200,
    //             to_time: 32400,
    //           },
    //         }
    //       : {
    //           routing_type: routing,
    //         }),
    //   };

    //   if (routing === "pt") {
    //     SendPTIsochroneRequest(isochroneBody);
    //   } else if (routing === "car_peak") {
    //     SendCarIsochroneRequest(isochroneBody);
    //   } else {
    //     SendIsochroneRequest(isochroneBody);
    //   }
    // }
  };

  const getCurrentValues = useMemo(() => {
    return watchFormValues;
  }, [watchFormValues]);

  // useEffect(() => {
  //   const subscription = watch((value) =>
  //     console.log(value)
  //   )
  //   return () => subscription.unsubscribe()
  // }, [watch])

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
