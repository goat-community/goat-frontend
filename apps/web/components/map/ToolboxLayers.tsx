import MaskLayer from "@/components/map/MaskLayer";
import { useAppSelector } from "@/hooks/store/ContextHooks";
import { GEOAPI_BASE_URL } from "@/lib/constants";
import { useTheme } from "@mui/material";
import { ICON_NAME, Icon } from "@p4b/ui/components/Icon";
import { useMemo } from "react";
import { Marker } from "react-map-gl";
import { v4 } from "uuid";

const ToolboxLayers = () => {
  const maskLayer = useAppSelector((state) => state.map.maskLayer);
  const theme = useTheme();
  const maskLayerUrl = useMemo(() => {
    if (maskLayer) {
      return `${GEOAPI_BASE_URL}/collections/${maskLayer}/items?limit=10&f=geojson`;
    }
    return null;
  }, [maskLayer]);
  const startingPoints = useAppSelector(
    (state) => state.map.toolboxStartingPoints,
  );

  return (
    <>
      {/* MASK LAYER  (Shows where tool computation is available*/}
      {maskLayerUrl && (
        <MaskLayer maskLayerUrl={maskLayerUrl} id="mask-layer" />
      )}
      {startingPoints &&
        startingPoints.map((marker) => (
          <Marker
            key={v4()}
            longitude={marker[0]}
            latitude={marker[1]}
            anchor="bottom"
          >
            <Icon
              iconName={ICON_NAME.LOCATION}
              htmlColor={theme.palette.error.main}
              fontSize="large"
            />
          </Marker>
        ))}
    </>
  );
};

export default ToolboxLayers;
