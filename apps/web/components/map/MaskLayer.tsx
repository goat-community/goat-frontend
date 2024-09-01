import { useEffect, useState } from "react";
import { Layer, Source } from "react-map-gl/maplibre";

import type { GeoJSONFeature } from "@/lib/utils/map/mask";
import createMask from "@/lib/utils/map/mask";

type MaskLayerProps = {
  maskLayerUrl: string;
  maskLayerColor?: string;
  id: string;
  beforeId?: string;
};

const MaskLayer = (props: MaskLayerProps) => {
  const [maskLayerData, setMaskLayerData] = useState<GeoJSONFeature | null>(null);

  useEffect(() => {
    fetch(props.maskLayerUrl)
      .then((response) => response.json())
      .then((data) => {
        const maskedData = createMask(data);
        setMaskLayerData(maskedData);
      })
      .catch((error) => {
        console.error("Error fetching mask layer data", error);
        setMaskLayerData(null);
      });
  }, [props.maskLayerUrl]);

  return (
    <>
      {/* MASK LAYER  (Shows where tool computation is available*/}
      {maskLayerData && (
        <Source type="geojson" data={maskLayerData}>
          <Layer
            id={props.id}
            type="fill"
            beforeId={props.beforeId}
            paint={{
              "fill-color": props.maskLayerColor || "#808080",
              "fill-opacity": 0.8,
            }}
          />
        </Source>
      )}
    </>
  );
};

export default MaskLayer;
