import * as z from "zod";
import { responseSchema } from "@/lib/validations/response";
import {
  contentMetadataSchema,
  data_type,
  featureLayerGeometryType,
  featureLayerType,
  getContentQueryParamsSchema,
  layerType,
} from "@/lib/validations/common";
import { DEFAULT_COLOR, DEFAULT_COLOR_RANGE } from "@/lib/constants/color";

export const layerMetadataSchema = contentMetadataSchema.extend({
  data_source: z.string().optional(),
  data_reference_year: z.number().optional(),
});

const HexColor = z.string();
const ColorMap = z.array(
  z.tuple([
    z.union([z.array(z.string()), z.string(), z.number(), z.null()]),
    HexColor,
  ]),
);

export const classBreaks = z.enum([
  "quantile",
  "standard_deviation",
  "equal_interval",
  "heads_and_tails",
  "ordinal",
  "custom_breaks",
]);
export const sizeScale = z.enum(["linear", "logarithmic", "exponential"]);
const layerFieldType = z.object({
  name: z.string(),
  type: z.union([z.literal("string"), z.literal("number")]),
});

export const layerClassBreaks = z.object({
  min: z.number(),
  max: z.number(),
  mean: z.number(),
  breaks: z.array(z.number()),
});

const ColorLegends = z.record(z.string());
const ColorRange = z.object({
  name: z.string().optional(),
  type: z.string().optional(),
  category: z.string().optional(),
  colors: z.array(HexColor),
  reversed: z.boolean().optional(),
  colorMap: ColorMap.optional(),
  colorLegends: ColorLegends.optional(),
});

export const TextLabelSchema = z.object({
  size: z.number().min(1).max(100).default(14),
  color: z.array(z.number().min(0).max(255)).optional().default([0, 0, 0]),
  field: z.string().optional(),
  offset: z.array(z.number().min(0).max(100)).optional().default([0, 0]),
  anchor: z.enum(["start", "middle", "end"]).optional().default("middle"),
  alignment: z.enum(["center", "left", "right"]).optional().default("center"),
  background: z.boolean().optional().default(false),
  background_color: z
    .array(z.number().min(0).max(255))
    .optional()
    .default([0, 0, 200, 255]),
  outline_color: z
    .array(z.number().min(0).max(255))
    .optional()
    .default([255, 0, 0, 255]),
  outline_width: z.number().min(0).max(100).optional().default(0),
});

export const TextLabel = z.array(TextLabelSchema);

export const layerPropertiesBaseSchema = z.object({
  opacity: z.number().min(0).max(1).default(0.8),
  visibility: z.boolean(),
  min_zoom: z.number().min(0).max(23).default(0),
  max_zoom: z.number().min(0).max(23).default(21),
});

export const colorSchema = z.object({
  color: z.array(z.number().min(0).max(255)).optional().default(DEFAULT_COLOR),
  color_range: ColorRange.optional().default(DEFAULT_COLOR_RANGE),
  color_field: layerFieldType.optional(),
  color_scale: classBreaks.optional().default("quantile"),
  color_scale_breaks: layerClassBreaks.optional(),
});

export const strokeColorSchema = z.object({
  stroke_color: z
    .array(z.number().min(0).max(255))
    .optional()
    .default(DEFAULT_COLOR),
  stroke_color_range: ColorRange.optional().default(DEFAULT_COLOR_RANGE),
  stroke_color_field: layerFieldType.optional(),
  stroke_color_scale: classBreaks.optional().default("quantile"),
  stroke_color_scale_breaks: layerClassBreaks.optional(),
});

export const strokeWidthSchema = z.object({
  stroke_width: z.number().min(0).max(200).default(2),
  stroke_width_range: z.array(z.number().min(0).max(200)).default([0, 10]),
  stroke_width_field: layerFieldType.optional(),
  stroke_width_scale: sizeScale.optional().default("linear"),
});

export const radiusSchema = z.object({
  radius: z.number().min(0).max(100).default(10),
  radius_range: z.array(z.number().min(0).max(500)).default([0, 10]),
  fixed_radius: z.boolean().default(false),
  radius_field: layerFieldType.optional(),
  radius_scale: sizeScale.optional().default("linear"),
});

export const markerSchema = z.object({
  custom_marker: z.boolean().default(false),
});

export const featureLayerBasePropertiesSchema = z
  .object({
    filled: z.boolean().default(true),
    stroked: z.boolean().default(true),
    text_label: TextLabel.optional(),
  })
  .merge(layerPropertiesBaseSchema)
  .merge(colorSchema)
  .merge(strokeColorSchema)
  .merge(strokeWidthSchema);

export const featureLayerPointPropertiesSchema =
  featureLayerBasePropertiesSchema
    .merge(strokeColorSchema)
    .merge(radiusSchema)
    .merge(markerSchema);

export const featureLayerLinePropertiesSchema =
  featureLayerBasePropertiesSchema;

export const featureLayerPolygonPropertiesSchema =
  featureLayerBasePropertiesSchema.merge(strokeColorSchema);

export const featureLayerProperties = featureLayerPointPropertiesSchema
  .or(featureLayerLinePropertiesSchema)
  .or(featureLayerPolygonPropertiesSchema);

export const layerSchema = layerMetadataSchema.extend({
  id: z.number(),
  properties: featureLayerProperties,
  total_count: z.number().optional(),
  extent: z.string(),
  folder_id: z.string(),
  user_id: z.string().uuid(),
  type: layerType,
  size: z.number().optional(),
  other_properties: z.object({}).optional(),
  url: z.string().optional(),
  feature_layer_type: featureLayerType.optional(),
  feature_layer_geometry_type: featureLayerGeometryType.optional(),
  data_type: data_type.optional(),
  legend_urls: z.array(z.string()).optional(),
  attribute_mapping: z.object({}).optional(),
  updated_at: z.string(),
  created_at: z.string(),
});

export const getLayersQueryParamsSchema = getContentQueryParamsSchema.extend({
  layer_type: layerType.array().optional(),
  feature_layer_type: featureLayerType.optional(),
});

export const createLayerBaseSchema = layerMetadataSchema.extend({
  folder_id: z.string().uuid(),
});

export const createFeatureLayerSchema = createLayerBaseSchema.extend({
  dataset_id: z.string().uuid(),
});

export const createNewScenarioLayerSchema = createLayerBaseSchema.extend({
  type: z.literal("feature_layer"),
  feature_layer_type: featureLayerType.optional(),
  scenario_id: z.string().uuid(),
  scenario_type: z.enum(["point", "area"]),
});

export const createNewExternalImageryLayerSchema = createLayerBaseSchema.extend(
  {
    type: z.literal("imagery_layer"),
    url: z.string().url(),
    data_type: data_type,
    legend_urls: z.array(z.string().url()).optional(),
    extent: z.string().optional(),
  },
);

export const createNewExternalTileLayerSchema = createLayerBaseSchema.extend({
  type: z.literal("tile_layer"),
  url: z.string().url(),
  data_type: data_type,
  extent: z.string().optional(),
});

export const layerQueryables = z.object({
  title: z.string(),
  properties: z.record(layerFieldType),
  type: z.string(),
  $schema: z.string(),
  $id: z.string(),
});

export const layerResponseSchema = responseSchema(layerSchema);
export const layerTypesArray = Object.values(layerType.Values);
export const featureLayerTypesArray = Object.values(featureLayerType.Values);

export type ColorRange = z.infer<typeof ColorRange>;
export type Layer = z.infer<typeof layerSchema>;
export type FeatureLayerProperties = z.infer<typeof featureLayerProperties>;
export type FeatureLayerPointProperties = z.infer<
  typeof featureLayerPointPropertiesSchema
>;
export type FeatureLayerLineProperties = z.infer<
  typeof featureLayerLinePropertiesSchema
>;
export type FeatureLayerPolygonProperties = z.infer<
  typeof featureLayerPolygonPropertiesSchema
>;
export type LayerPaginated = z.infer<typeof layerResponseSchema>;
export type LayerType = z.infer<typeof layerType>;
export type LayerQueryables = z.infer<typeof layerQueryables>;
export type ClassBreaks = z.infer<typeof classBreaks>;
export type LayerClassBreaks = z.infer<typeof layerClassBreaks>;
export type LayerFieldType = z.infer<typeof layerFieldType>;
export type LayerMetadata = z.infer<typeof layerMetadataSchema>;
export type FeatureLayerType = z.infer<typeof featureLayerType>;
export type GetLayersQueryParams = z.infer<typeof getLayersQueryParamsSchema>;
export type CreateFeatureLayer = z.infer<typeof createFeatureLayerSchema>;
export type CreateNewScenarioLayer = z.infer<
  typeof createNewScenarioLayerSchema
>;
export type CreateNewExternalImageryLayer = z.infer<
  typeof createNewExternalImageryLayerSchema
>;
export type CreateNewExternalTileLayer = z.infer<
  typeof createNewExternalTileLayerSchema
>;
