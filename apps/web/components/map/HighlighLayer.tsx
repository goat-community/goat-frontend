import type { MapGeoJSONFeature } from "react-map-gl";
import { Source, Layer } from "react-map-gl";

const HIGHLIGHT_COLOR = "#FFC300";

const HighlightLayer = ({
  highlightFeature,
}: {
  highlightFeature?: MapGeoJSONFeature | null;
}) => {
  if (!highlightFeature) return null;

  const layerType = highlightFeature.layer?.type;
  let type;
  let paint;

  switch (layerType) {
    case "symbol":
    case "circle":
      type = "circle";
      const strokeWidth =
        highlightFeature.layer.paint?.["circle-stroke-width"] ?? 0;

      paint = {
        "circle-color": HIGHLIGHT_COLOR,
        "circle-opacity": highlightFeature.layer.type === "symbol" ? 0 : 0.8,
        "circle-radius":
          (highlightFeature.layer.paint?.["circle-radius"] < 8
            ? 8
            : highlightFeature.layer.paint?.["circle-radius"]) + strokeWidth,
      };
      break;
    case "fill":
    case "line":
      type = "line";
      paint = {
        "line-color": HIGHLIGHT_COLOR,
        "line-width": highlightFeature.layer.paint?.["line-width"] ?? 2,
      };
      break;
    default:
      return null;
  }

  return (
    <Source type="geojson" data={highlightFeature}>
      {highlightFeature && (
        <Layer id={highlightFeature.id?.toString()} type={type} paint={paint} />
      )}
    </Source>
  );
};

export default HighlightLayer;
