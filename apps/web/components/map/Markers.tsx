import React from "react";
import { Marker } from "react-map-gl";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { Icon, ICON_NAME } from "@p4b/ui/components/Icon";
import { Box, useTheme } from "@mui/material";

import type { IStore } from "@/types/store";

const Markers = () => {
  const { markers } = useSelector((state: IStore) => state.map);

  const theme = useTheme();

  return (
    <>
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          longitude={marker.long}
          latitude={marker.lat}
          anchor="bottom"
        >
          <Box position="relative">
            <Icon iconName={ICON_NAME.LOCATION_MARKER} htmlColor="#cf0707" fontSize="large"/>
            <Box position="absolute" top="3px" left="50%" sx={{
              transform: "translateX(-50%)"
            }}>
              <Icon iconName={marker.iconName as ICON_NAME} htmlColor={theme.palette.background.paper} sx={{
                fontSize: "17px"
              }}/>
            </Box>
          </Box>
        </Marker>
      ))}
    </>
  );
};

export default Markers;
