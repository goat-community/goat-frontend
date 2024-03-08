import { MARKER_IMAGE_PREFIX } from "@/lib/transformers/marker";
import type { MapGeoJSONFeature } from "react-map-gl";
import { rgbToHex } from "@/lib/utils/helpers";
import type {
  FeatureLayerLineProperties,
  FeatureLayerPointProperties,
  Layer,
} from "@/lib/validations/layer";
import type { ProjectLayer } from "@/lib/validations/project";

import type { RGBColor } from "@/types/map/color";

const HIGHLIGHT_COLOR = "#FFC300";

export function getMapboxStyleColor(
  data: ProjectLayer | Layer,
  type: "color" | "stroke_color",
) {
  const colors = data.properties[`${type}_range`]?.colors;
  const fieldName = data.properties[`${type}_field`]?.name;
  const fieldType = data.properties[`${type}_field`]?.type;
  const colorScale = data.properties[`${type}_scale`];
  const colorMaps = data.properties[`${type}_range`]?.color_map;

  if (
    colorMaps &&
    fieldName &&
    Array.isArray(colorMaps) &&
    colorScale === "ordinal"
  ) {
    const valuesAndColors = [] as (string | number)[];
    colorMaps.forEach((colorMap) => {
      const colorMapValue = colorMap[0];
      const colorMapHex = colorMap[1];
      if (!colorMapValue || !colorMapHex) return;
      if (Array.isArray(colorMapValue)) {
        colorMapValue.forEach((value: string) => {
          if (fieldType === "number" && value !== null) {
            valuesAndColors.push(Number(value));
          } else {
            valuesAndColors.push(value);
          }
          valuesAndColors.push(colorMapHex);
        });
      } else {
        if (fieldType === "number" && colorMapValue !== null) {
          valuesAndColors.push(Number(colorMapValue));
        } else {
          valuesAndColors.push(colorMapValue);
        }
        valuesAndColors.push(colorMapHex);
      }
    });

    return ["match", ["get", fieldName], ...valuesAndColors, "#AAAAAA"];
  }

  if (
    !fieldName ||
    !colors ||
    data.properties[`${type}_scale_breaks`]?.breaks.length !== colors.length - 1
  ) {
    return data.properties[type]
      ? rgbToHex(data.properties[type] as RGBColor)
      : "#AAAAAA";
  }

  const colorSteps = colors
    .map((color, index) => {
      if (index === colors.length - 1) {
        return [colors[index]];
      } else {
        return [
          color,
          data.properties[`${type}_scale_breaks`]?.breaks[index] || 0,
        ];
      }
    })
    .flat();
  const config = ["step", ["get", fieldName], ...colorSteps];
  return config;
}

export function getMapboxStyleMarker(data: ProjectLayer | Layer) {
  const properties = data.properties as FeatureLayerPointProperties;
  const markerMaps = properties.marker_mapping;
  const fieldName = properties.marker_field?.name;
  const fieldType = properties.marker_field?.type;
  const marker = `${MARKER_IMAGE_PREFIX}${properties.marker?.name}`;
  if (markerMaps && fieldName) {
    const valuesAndIcons = [] as (string | number)[];
    markerMaps.forEach((markerMap) => {
      const markerMapValue = markerMap[0];
      const markerMapIcon = markerMap[1];
      if (!markerMapValue || !markerMapIcon) return;
      if (Array.isArray(markerMapValue)) {
        markerMapValue.forEach((value: string) => {
          if (fieldType === "number" && value !== null) {
            valuesAndIcons.push(Number(value));
          } else {
            valuesAndIcons.push(value);
          }
          valuesAndIcons.push(`${MARKER_IMAGE_PREFIX}${markerMapIcon.name}`);
        });
      } else {
        if (fieldType === "number" && markerMapValue !== null) {
          valuesAndIcons.push(Number(markerMapValue));
        } else {
          valuesAndIcons.push(markerMapValue);
        }
        valuesAndIcons.push(`${MARKER_IMAGE_PREFIX}${markerMapIcon.name}`);
      }
    });

    return ["match", ["get", fieldName], ...valuesAndIcons, marker];
  }

  return marker;
}

export function transformToMapboxLayerStyleSpec(data: ProjectLayer | Layer) {
  const type = data.feature_layer_geometry_type;
  if (type === "point") {
    const pointProperties = data.properties as FeatureLayerPointProperties;
    if (pointProperties.custom_marker) {
      return {
        type: "symbol",
        layout: {
          visibility: data.properties.visibility ? "visible" : "none",
          "icon-image": getMapboxStyleMarker(data),
          "icon-size": 1, // This is a scale factor not in px
        },
        paint: {
          "icon-opacity": pointProperties.filled ? pointProperties.opacity : 1,
          "icon-color": getMapboxStyleColor(data, "color"),
        },
      };
    }

    return {
      type: "circle",
      layout: {
        visibility: data.properties.visibility ? "visible" : "none",
      },
      paint: {
        "circle-color": getMapboxStyleColor(data, "color"),
        "circle-opacity": pointProperties.filled ? pointProperties.opacity : 0,
        "circle-radius": pointProperties.radius || 5,
        "circle-stroke-color": getMapboxStyleColor(data, "stroke_color"),
        "circle-stroke-width": pointProperties.stroked
          ? pointProperties.stroke_width || 1
          : 0,
      },
    };
  } else if (type === "polygon") {
    const polygonProperties = data.properties as FeatureLayerLineProperties;
    return {
      type: "fill",
      layout: {
        visibility: data.properties.visibility ? "visible" : "none",
      },
      paint: {
        "fill-color": getMapboxStyleColor(data, "color"),
        "fill-opacity": polygonProperties.filled
          ? polygonProperties.opacity
          : 0,
        "fill-outline-color": getMapboxStyleColor(data, "stroke_color"),
        "fill-antialias": polygonProperties.stroked,
      },
    };
  } else if (type === "line") {
    const lineProperties = data.properties as FeatureLayerLineProperties;

    return {
      type: "line",
      layout: {
        visibility: data.properties.visibility ? "visible" : "none",
      },
      paint: {
        "line-color": getMapboxStyleColor(data, "stroke_color"),
        "line-opacity": lineProperties.opacity,
        "line-width": lineProperties.stroke_width || 1,
      },
    };
  } else {
    throw new Error(`Invalid type: ${type}`);
  }
}

export function getHightlightStyleSpec(highlightFeature: MapGeoJSONFeature) {
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
      let radius;
      if (highlightFeature.layer.type === "symbol") {
        radius = 5;
      } else {
        radius =
          (highlightFeature.layer.paint?.["circle-radius"] as number < 8
            ? 8
            : highlightFeature.layer.paint?.["circle-radius"]) + strokeWidth;
      }

      paint = {
        "circle-color": HIGHLIGHT_COLOR,
        "circle-opacity": 0.8,
        "circle-radius": radius,
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

  return {
    type,
    paint,
    ...(highlightFeature.properties?.id && {
      filter: ["in", "id", highlightFeature.properties.id],
    }),
  };
}
