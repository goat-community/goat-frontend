import EmptySection from "@/components/common/EmptySection";
import { MaskedImageIcon } from "@/components/map/panels/style/other/MaskedImageIcon";
import { useTranslation } from "@/i18n/client";
import { formatNumber, rgbToHex } from "@/lib/utils/helpers";
import type {
  FeatureLayerPointProperties,
  FeatureLayerProperties,
  LayerClassBreaks,
} from "@/lib/validations/layer";
import type { ProjectLayer } from "@/lib/validations/project";
import type { RGBColor } from "@/types/map/color";
import { Stack, Tooltip, Typography } from "@mui/material";
import { ICON_NAME } from "@p4b/ui/components/Icon";
import { useMemo } from "react";

const DEFAULT_COLOR = "#000000";
export interface LegendProps {
  layers: ProjectLayer[];
  hideLayerName?: boolean;
  hideZoomLevel?: boolean;
}

type ColorMapItem = {
  value: string[] | null;
  color: string;
};

type MarkerMapItem = {
  value: string[] | null;
  marker: string | null;
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
    value: [range],
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
      value: ["No data"],
      color: DEFAULT_COLOR,
    });
  } else {
    if (properties[type]) {
      colorMap.push({
        value: [""],
        color: rgbToHex(properties[type] as RGBColor),
      });
    }
  }
  return colorMap;
}

function getLegendMarkerMap(properties: FeatureLayerProperties) {
  const markerMap = [] as MarkerMapItem[];
  const point = properties as FeatureLayerPointProperties;
  if (point.marker_field) {
    point.marker_mapping?.forEach((value) => {
      if (value[1].url && value[0])
        markerMap.push({
          value: value[0],
          marker: value[1].url,
        });
    });
  } else {
    markerMap.push({
      value: [""],
      marker: point.marker?.url || null,
    });
  }
  return markerMap;
}

function LegendRow({
  type,
  fillColor,
  strokeColor,
  markerImageUrl,
  label,
}: {
  type: "point" | "line" | "polygon" | "marker";
  fillColor?: string;
  strokeColor?: string;
  markerImageUrl?: string | null;
  label?: string | number | string[] | null;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: "5px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        {type !== "marker" && (
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
                stroke={strokeColor}
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
        )}
        {type === "marker" && markerImageUrl && (
          <MaskedImageIcon imageUrl={`${markerImageUrl}`} dimension="19px" />
        )}
      </div>
      <Typography
        variant="caption"
        fontWeight="bold"
        style={{ marginLeft: "10px" }}
      >
        {label}
      </Typography>
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
  const { t } = useTranslation("common");

  const { colorMap, strokeColorMap } = useMemo(
    () => ({
      colorMap: getLegendColorMap(properties, "color"),
      strokeColorMap: getLegendColorMap(properties, "stroke_color"),
    }),
    [properties],
  );

  const markerMap = useMemo(() => {
    return getLegendMarkerMap(properties);
  }, [properties]);

  const isSimpleColor = useMemo(() => {
    {
      if (type === "line") {
        return !properties.stroke_color_field && properties.stroke_color;
      } else if (type === "polygon" || type === "point") {
        return !properties.color_field && properties.color;
      }
    }
  }, [
    properties.color,
    properties.color_field,
    properties.stroke_color,
    properties.stroke_color_field,
    type,
  ]);

  const isStrokeEnabled = useMemo(() => {
    return (
      type === "line" ||
      (["polygon", "point"].includes(type) &&
        strokeColorMap.length > 1 &&
        properties.stroked)
    );
  }, [properties.stroked, strokeColorMap, type]);

  const shouldRenderColorMap = useMemo(() => {
    return (
      colorMap &&
      Array.isArray(colorMap) &&
      colorMap.length > 0 &&
      ((!properties.stroke_color_field && type === "line") || type !== "line")
    );
  }, [colorMap, properties.stroke_color_field, type]);

  return (
    <>
      {/* FILL OR STROKE COLOR */}
      {!isSimpleColor && properties.filled && type !== "line" && (
        <Stack sx={{ pb: 2 }}>
          <Typography variant="caption">{t("fill_color_based_on")}</Typography>
          <Typography variant="caption" fontWeight="bold">
            {properties.color_field?.name}
          </Typography>
        </Stack>
      )}
      {isSimpleColor && (
        <Stack sx={{ pb: 2 }}>
          <Typography variant="caption">
            {type === "line" ? t("stroke_color") : t("fill_color")}
          </Typography>
        </Stack>
      )}

      {shouldRenderColorMap &&
        colorMap.map(
          (item) =>
            item.value?.length &&
            item.value.map((value) => (
              <LegendRow
                key={`${value?.toString()}_${item.color}`}
                type={type}
                fillColor={item.color}
                strokeColor={
                  strokeColorMap.length === 1 && properties.stroked
                    ? strokeColorMap[0].color
                    : undefined
                }
                label={value}
              />
            )),
        )}

      {/* LINE COLOR OR STROKE COLOR WHEN ATTRIBUTE STYLING */}
      {isStrokeEnabled && (
        <>
          {properties.stroke_color_field && (
            <Stack
              sx={{
                pb: 2,
                ...(type !== "line" && properties.filled && { pt: 2 }),
              }}
            >
              <Typography variant="caption">
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
            strokeColorMap.map(
              (item) =>
                item.value?.length &&
                item.value.map((value) => (
                  <LegendRow
                    key={`${value?.toString()}_${item.color}`}
                    type={type}
                    strokeColor={item.color}
                    label={value}
                  />
                )),
            )}
        </>
      )}

      {/* MARKERS */}

      {type === "point" &&
        properties["custom_marker"] &&
        markerMap &&
        Array.isArray(markerMap) &&
        markerMap.length > 0 && (
          <>
            <Stack
              sx={{
                ...(properties.filled && { pt: 2, pb: 2 }),
              }}
            >
              <Typography variant="caption">
                {properties["marker_field"]
                  ? t("marker_based_on")
                  : t("marker")}
              </Typography>
              {properties["marker_field"] && (
                <Typography variant="caption" fontWeight="bold">
                  {properties["marker_field"].name}
                </Typography>
              )}
            </Stack>

            {markerMap.map(
              (item) =>
                item.value?.length &&
                item.value.map((value) => (
                  <LegendRow
                    key={`${value?.toString()}_${item.marker}`}
                    type="marker"
                    markerImageUrl={item.marker}
                    label={value}
                  />
                )),
            )}
          </>
        )}
    </>
  );
}

export function Legend(props: LegendProps) {
  const { t } = useTranslation("common");
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
            {!props.hideLayerName && (
              <Typography variant="body2" fontWeight="bold">
                {layer.name}
              </Typography>
            )}
            {!props.hideZoomLevel && (
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
            )}
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

        {props.layers?.length === 0 && (
          <EmptySection label={t("no_active_layers")} icon={ICON_NAME.LAYERS} />
        )}
      </>
    )
  );
}
