import { rgbToHex } from "@/lib/utils/helpers";
import type {
  FeatureLayerLineProperties,
  FeatureLayerPointProperties,
} from "@/lib/validations/layer";
import type { ProjectLayer } from "@/lib/validations/project";

import type { RGBColor } from "@/types/map/color";

export function getMapboxStyleColor(
  data: ProjectLayer,
  type: "color" | "stroke_color",
) {
  const colors = data.properties[`${type}_range`].colors;
  const fieldName = data.properties[`${type}_field`]?.name;
  if (
    !fieldName ||
    !colors ||
    data.properties[`${type}_scale_breaks`]?.breaks.length !== colors.length - 1
  ) {
    return data.properties[type]
      ? rgbToHex(data.properties[type] as RGBColor)
      : "#000000";
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
  console.log(colorSteps);
  const config = ["step", ["get", fieldName], ...colorSteps];

  return config;
}

export function transformToMapboxLayerStyleSpec(data: ProjectLayer) {
  const type = data.feature_layer_geometry_type;
  if (type === "point") {
    const pointProperties = data.properties as FeatureLayerPointProperties;

    return {
      type: "circle",
      paint: {
        "circle-color": getMapboxStyleColor(data, "color"),
        "circle-opacity": 1, //todo
        "circle-radius": pointProperties.radius || 5,
        "circle-stroke-color": getMapboxStyleColor(data, "stroke_color"),
        "circle-stroke-width": pointProperties.stroked
          ? pointProperties.stroke_width || 1
          : 0,
      },
    };
  } else if (type === "polygon") {
    const polygonProperties = data.properties as FeatureLayerLineProperties;
    console.log(polygonProperties);
    return {
      type: "fill",
      paint: {
        "fill-color": getMapboxStyleColor(data, "color"),
        "fill-opacity": 1, // todo
        "fill-outline-color": getMapboxStyleColor(data, "stroke_color"),
      },
    };
  } else if (type === "line") {
    const lineProperties = data.properties as FeatureLayerLineProperties;

    return {
      type: "line",
      paint: {
        "line-color": getMapboxStyleColor(data, "color"),
        "line-opacity": 1, // todo
        "line-width": lineProperties.stroke_width || 1,
      },
    };
  } else {
    throw new Error(`Invalid type: ${type}`);
  }
}
