import React from "react";
import { Marker } from "react-map-gl";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { Icon, ICON_NAME } from "@p4b/ui/components/Icon";
import { Box, useTheme } from "@mui/material";

const Markers = () => {
  const { markers } = useSelector((state) => state.styling);

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
              <Icon iconName={marker.iconName} htmlColor={theme.palette.background.paper} sx={{
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
