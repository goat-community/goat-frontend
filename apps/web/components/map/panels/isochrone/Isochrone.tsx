import React, { useState } from "react";
import Container from "@/components/map/panels/Container";
import { Box, Button, useTheme } from "@mui/material";
import IsochroneSettings from "@/components/map/panels/isochrone/IsochroneSettings";
import StartingPoint from "@/components/map/panels/isochrone/StartingPoint";
import { useTranslation } from "@/i18n/client";
import SaveResult from "@/components/map/panels/toolbox/tools/SaveResult";

import type { MapSidebarItem } from "@/types/map/sidebar";
import type { StartingPointType } from "@/types/map/isochrone";

type IsochroneProps = {
  setActiveRight: (item: MapSidebarItem | undefined) => void;
};

type RoutingTypes =
  | "bus"
  | "tram"
  | "rail"
  | "subway"
  | "ferry"
  | "cable_car"
  | "gondola"
  | "funicular"
  | "walk"
  | "bicycle"
  | "car";

const Isochrone = (props: IsochroneProps) => {
  // Isochrone Settings states
  const [routing, setRouting] = useState<RoutingTypes | undefined>(undefined);
  const [speed, setSpeed] = useState<number | undefined>(undefined);
  const [distance, setDistance] = useState<number | undefined>(undefined);
  const [travelTime, setTravelTime] = useState<number | undefined>(undefined);
  const [steps, setSteps] = useState<number | undefined>(undefined);
  const [outputName, setOutputName] = useState<string | undefined>(undefined);
  const [folderSaveID, setFolderSaveID] = useState<string | undefined>(
    undefined,
  );

  // Sarting point states
  const [startingType, setStartingType] = useState<
    StartingPointType | undefined
  >(undefined);
  const [startingPoint, setStartingPoint] = useState<string | undefined>(
    undefined,
  );

  const theme = useTheme();
  const { t } = useTranslation("maps");
  const { setActiveRight } = props;

  return (
    <Container
      title="Legend"
      close={setActiveRight}
      direction="left"
      body={
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          sx={{ height: "100%" }}
        >
          <Box sx={{ maxHeight: "95%", overflow: "scroll" }}>
            <IsochroneSettings
              routing={routing}
              setRouting={setRouting}
              distance={distance}
              setDistance={setDistance}
              speed={speed}
              setSpeed={setSpeed}
              travelTime={travelTime}
              setTravelTime={setTravelTime}
              steps={steps}
              setSteps={setSteps}
            />
            <StartingPoint
              startingType={startingType}
              setStartingType={setStartingType}
              startingPoint={startingPoint}
              setStartingPoint={setStartingPoint}
            />
            <SaveResult
              outputName={outputName}
              setOutputName={setOutputName}
              folderSaveId={folderSaveID}
              setFolderSaveID={setFolderSaveID}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: theme.spacing(2),
              alignItems: "center",
            }}
          >
            <Button
              variant="outlined"
              sx={{ flexGrow: "1" }}
              // onClick={handleReset}
            >
              {t("panels.tools.reset")}
            </Button>
            <Button
              sx={{ flexGrow: "1" }}
              // onClick={handleRun}
            >
              {t("panels.tools.run")}
            </Button>
          </Box>
        </Box>
      }
    />
  );
};

export default Isochrone;
