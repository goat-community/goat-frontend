import React, { useState } from "react";
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
import { v4 } from "uuid";
import { useDispatch } from "react-redux";
import { removeMarker } from "@/lib/store/styling/slice";

import type { StartingPointType } from "@/types/map/isochrone";
import type { RoutingTypes, PTModeTypes } from "@/types/map/isochrone";

const Isochrone = () => {
  // Isochrone Settings states
  const [routing, setRouting] = useState<RoutingTypes | undefined>(undefined);
  const [ptModes, setPtModes] = useState<PTModeTypes[] | undefined>([
    "bus",
    "tram",
    "rail",
    "subway",
    "ferry",
    "cable_car",
    "gondola",
    "funicular",
  ]);
  const [speed, setSpeed] = useState<number | undefined>(undefined);
  const [distance, setDistance] = useState<number | undefined>(undefined);
  const [travelTime, setTravelTime] = useState<number | undefined>(undefined);
  const [steps, setSteps] = useState<number | undefined>(undefined);

  // Sarting point states
  const [startingType, setStartingType] = useState<
    StartingPointType | undefined
  >(undefined);
  const [startingPoint, setStartingPoint] = useState<string[] | undefined>(
    undefined,
  );

  // Save Result states
  const [outputName, setOutputName] = useState<string>(`isochrone-${v4()}`);
  const [folderSaveID, setFolderSaveID] = useState<string | undefined>(
    undefined,
  );

  const theme = useTheme();
  const { t } = useTranslation("maps");
  const dispatch = useDispatch();

  const handleReset = () => {
    setRouting(undefined);
    setSpeed(undefined);
    setDistance(undefined);
    setTravelTime(undefined);
    setSteps(undefined);
    setOutputName(`isochrone-${v4()}`);
    setFolderSaveID(undefined);
    setStartingType(undefined);
    setStartingPoint(undefined);
    dispatch(removeMarker());
  };

  const getStartingPoint = () => {
    if (startingType && startingPoint) {
      switch (startingType) {
        case "place_on_map":
          console.log(startingPoint)
          return {
            latitude: [
              ...startingPoint.map((startPoint) =>
                parseFloat(startPoint.split(",")[0]),
              ),
            ],
            longitude: [
              ...startingPoint.map((startPoint) =>
                parseFloat(startPoint.split(",")[1]),
              ),
            ],
          };
        case "address_input":
          return {
            latitude: [parseFloat(startingPoint[1])],
            longitude: [parseFloat(startingPoint[0])],
          };
        case "browse_layers":
          return {
            layer_id: startingPoint,
          };
      }
    }
  };

  const handleRun = () => {
    if (
      routing &&
      startingPoint &&
      startingType &&
      steps &&
      outputName &&
      folderSaveID
    ) {
      const isochroneBody = {
        starting_points: getStartingPoint(),
        routing_type: routing,
        travel_cost: {},
        result_target: {
          layer_name: outputName,
          folder_id: folderSaveID,
        },
      };

      if (!distance) {
        isochroneBody.travel_cost = {
          max_traveltime: travelTime,
          traveltime_step: steps,
          speed: speed ? speed : undefined,
        };
      }

      if (!speed && !travelTime) {
        isochroneBody.travel_cost = {
          max_distance: distance,
          distance_step: steps,
        };
      }

      if (speed) {
        isochroneBody.travel_cost["speed"] = speed;
      }

      if (routing.includes(",")) {
        isochroneBody["routing_type"] = {
          mode: routing.split(","),
          egress_mode: "walk",
          access_mode: "walk",
        };

        isochroneBody["time_window"] = {
          weekday: "weekday",
          from_time: 25200,
          to_time: 32400,
        };
        SendPTIsochroneRequest(isochroneBody);
      } else if (routing === "car_peak") {
        SendCarIsochroneRequest(isochroneBody);
      } else {
        SendIsochroneRequest(isochroneBody);
      }
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      sx={{ height: "100%" }}
    >
      <Box sx={{ maxHeight: "95%", overflow: "scroll" }}>
        <Typography variant="body2" sx={{ fontStyle: "italic", marginBottom: theme.spacing(4) }}>
          Isochrones illustrate reachable areas within a set travel time or
          distance from a specific point, aiding in spatial analysis and route
          planning.
        </Typography>
        <IsochroneSettings
          routing={routing}
          setRouting={setRouting}
          ptModes={ptModes}
          setPtModes={setPtModes}
          distance={distance}
          setDistance={setDistance}
          speed={speed}
          setSpeed={setSpeed}
          travelTime={travelTime}
          setTravelTime={setTravelTime}
          steps={steps}
          setSteps={setSteps}
        />
        {routing ? (
          <StartingPoint
            routing={routing}
            startingType={startingType}
            setStartingType={setStartingType}
            startingPoint={startingPoint}
            setStartingPoint={setStartingPoint}
          />
        ) : null}
        {startingType && startingPoint ? (
          <SaveResult
            outputName={outputName}
            setOutputName={setOutputName}
            folderSaveId={folderSaveID}
            setFolderSaveID={setFolderSaveID}
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
