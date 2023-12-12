import React from "react";
import { Marker } from "react-map-gl";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { Icon } from "@p4b/ui/components/Icon";

import type { IStore } from "@/types/store";
import type { ICON_NAME } from "@p4b/ui/components/Icon";

const Markers = () => {
  const { markers } = useSelector((state: IStore) => state.map);

  // const theme = useTheme();

  return (
    <>
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          longitude={marker.long}
          latitude={marker.lat}
          anchor="bottom"
        >
          <Icon
            iconName={marker.iconName as ICON_NAME}
            htmlColor="#cf0707"
            fontSize="large"
          />
        </Marker>
      ))}
    </>
  );
};

export default Markers;
