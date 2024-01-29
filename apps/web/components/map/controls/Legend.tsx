import { useTranslation } from "@/i18n/client";
import { formatNumber, rgbToHex } from "@/lib/utils/helpers";
import type {
  FeatureLayerProperties,
  LayerClassBreaks,
} from "@/lib/validations/layer";
import type { ProjectLayer } from "@/lib/validations/project";
import type { RGBColor } from "@/types/map/color";
import { Stack, Tooltip, Typography } from "@mui/material";
import { useMemo } from "react";

const DEFAULT_COLOR = "#000000";
export interface LegendProps {
  layers: ProjectLayer[];
}

type ColorMapItem = {
  value: string | number | string[] | null;
  color: string;
};

const getColor = (colors: string[], index: number): string =>
  colors[index] !== undefined ? colors[index] : DEFAULT_COLOR;

const createRangeAndColor = (
  colorMap: ColorMapItem[],
  rangeStart: number,
  rangeEnd: number,
  color: string,
  isFirst?: boolean,
  isLast?: boolean,
): void => {
  const range = `${isFirst ? "<" : ""}${formatNumber(rangeStart, 2)} - 
    ${isLast ? ">" : ""}${formatNumber(rangeEnd, 2)}`;
  colorMap.push({
    value: range,
    color,
  });
};

function getLegendColorMap(
  properties: FeatureLayerProperties,
  type: "color" | "stroke_color",
) {
  const colorMap = [] as ColorMapItem[];
  if (properties?.[`${type}_field`]) {
    if (["ordinal", "custom_breaks"].includes(properties[`${type}_scale`])) {
      properties[`${type}_range`].color_map?.forEach((value) => {
        colorMap.push({
          value: value[0],
          color: value[1],
        });
      });
    } else {
      const classBreaksValues = properties[
        `${type}_scale_breaks`
      ] as LayerClassBreaks;
      const colors = properties[`${type}_range`]?.colors;
      if (
        classBreaksValues &&
        Array.isArray(classBreaksValues.breaks) &&
        colors
      ) {
        classBreaksValues.breaks.forEach((value, index) => {
          if (index === 0) {
            createRangeAndColor(
              colorMap,
              classBreaksValues.min,
              value,
              getColor(colors, index),
              true,
            );
            createRangeAndColor(
              colorMap,
              value,
              classBreaksValues.breaks[index + 1],
              getColor(colors, index + 1),
            );
          } else if (index === classBreaksValues.breaks.length - 1) {
            createRangeAndColor(
              colorMap,
              value,
              classBreaksValues.max,
              getColor(colors, index + 1),
              false,
              true,
            );
          } else {
            createRangeAndColor(
              colorMap,
              value,
              classBreaksValues.breaks[index + 1],
              getColor(colors, index + 1),
            );
          }
        });
      }
    }
    colorMap.push({
      value: "No data",
      color: DEFAULT_COLOR,
    });
  } else {
    colorMap.push({
      value: "",
      color: rgbToHex(properties[type] as RGBColor),
    });
  }
  return colorMap;
}

function LegendRow({
  type,
  fillColor,
  strokeColor,
  label,
}: {
  type: "point" | "line" | "polygon";
  fillColor?: string;
  strokeColor?: string;
  label?: string | number | string[] | null;
}) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "5px",
        }}
      >
        <svg height="20" width="20">
          {type === "point" && (
            <circle
              cx="10"
              cy="10"
              r="7"
              fillOpacity={fillColor ? 1 : 0}
              stroke={strokeColor}
              strokeWidth={strokeColor ? 2 : 0}
              fill={fillColor}
            />
          )}

          {type === "line" && (
            <line
              x1="0"
              y1="10"
              x2="20"
              y2="10"
              stroke={fillColor}
              strokeWidth="2"
            />
          )}

          {type === "polygon" && (
            <rect
              width="15"
              height="15"
              rx="3"
              fillOpacity={fillColor ? 1 : 0}
              fill={fillColor}
              stroke={strokeColor}
            />
          )}
        </svg>
        <Typography
          variant="caption"
          fontWeight="bold"
          style={{ marginLeft: "10px" }}
        >
          {label}
        </Typography>
      </div>
    </div>
  );
}

export function LegendRows({
  properties,
  type,
}: {
  properties: FeatureLayerProperties;
  type: "point" | "line" | "polygon";
}) {
  const { t } = useTranslation("maps");

  const { colorMap, strokeColorMap } = useMemo(
    () => ({
      colorMap: getLegendColorMap(properties, "color"),
      strokeColorMap: getLegendColorMap(properties, "stroke_color"),
    }),
    [properties],
  );

  return (
    <>
      {/* FILL COLOR */}
      {properties.color_field && type !== "line" && properties.filled && (
        <Stack sx={{ pb: 2 }}>
          <Typography variant="caption" sx={{ textTransform: "uppercase" }}>
            {t("fill_color_based_on")}
          </Typography>
          <Typography variant="caption" fontWeight="bold">
            {properties.color_field.name}
          </Typography>
        </Stack>
      )}
      {!properties.color_field &&
        properties.stroke_color_field &&
        properties.filled &&
        type !== "line" && (
          <Stack sx={{ pb: 2 }}>
            <Typography variant="caption" sx={{ textTransform: "uppercase" }}>
              {t("fill_color")}
            </Typography>
          </Stack>
        )}

      {colorMap &&
        type !== "line" &&
        properties.filled &&
        Array.isArray(colorMap) &&
        colorMap.length > 0 &&
        colorMap.map((item) => (
          <LegendRow
            key={`${item.value?.toString()}_${item.color}`}
            type={type}
            fillColor={item.color}
            strokeColor={
              strokeColorMap.length === 1 && properties.stroked
                ? strokeColorMap[0].color
                : undefined
            }
            label={item.value}
          />
        ))}

      {/* LINE COLOR OR STROKE COLOR WHEN ATTRIBUTE STYLING */}
      {type === "line" ||
        (["polygon", "point"].includes(type) &&
          strokeColorMap.length > 1 &&
          properties.stroked && (
            <>
              {properties.stroke_color_field && (
                <Stack sx={{ pb: 2 }}>
                  <Typography
                    variant="caption"
                    sx={{ textTransform: "uppercase" }}
                  >
                    {t("stroke_color_based_on")}
                  </Typography>
                  <Typography variant="caption" fontWeight="bold">
                    {properties.stroke_color_field.name}
                  </Typography>
                </Stack>
              )}

              {strokeColorMap &&
                Array.isArray(strokeColorMap) &&
                strokeColorMap.length > 1 &&
                strokeColorMap.map((item) => (
                  <LegendRow
                    key={`${item.value?.toString()}_${item.color}`}
                    type={type}
                    strokeColor={item.color}
                    label={item.value}
                  />
                ))}
            </>
          ))}
    </>
  );
}

export function Legend(props: LegendProps) {
  const { t } = useTranslation("maps");
  const geometryTypes = ["point", "line", "polygon"];

  return (
    props.layers && (
      <>
        {props.layers.map((layer) => (
          <Stack
            key={layer.id}
            spacing={1}
            direction="column"
            sx={{ my: 3 }}
            style={{ cursor: "default" }}
          >
            <Typography variant="body2" fontWeight="bold">
              {layer.name}
            </Typography>
            <Tooltip
              title={t("zoom_level_legend_tooltip")}
              placement="top"
              arrow
            >
              <Typography variant="caption">
                {`${t("zoom_level")} ${layer.properties.min_zoom} - ${
                  layer.properties.max_zoom
                }`}
              </Typography>
            </Tooltip>
            <Stack sx={{ py: 1 }}>
              {layer.type === "feature" && (
                <>
                  {geometryTypes.map(
                    (type) =>
                      layer.feature_layer_geometry_type === type &&
                      layer.properties && (
                        <LegendRows
                          key={type}
                          properties={layer.properties}
                          type={type}
                        />
                      ),
                  )}
                </>
              )}
            </Stack>
          </Stack>
        ))}
      </>
    )
  );
}
