import * as z from "zod";
import { responseSchema } from "@/lib/validations/response";
import { contentMetadataSchema, getContentQueryParamsSchema } from "@/lib/validations/common";

export const layerType = z.enum([
  "feature_layer",
  "imagery_layer",
  "tile_layer",
  "table",
]);

export const featureLayerType = z.enum([
  "standard",
  "indicator",
  "scenario",
  "street_network",
]);

export const data_type = z.enum(["wms", "mvt"]);

export const layerMetadataSchema = contentMetadataSchema.extend({
  data_source: z.string().optional(),
  data_reference_year: z.number().optional(),
});

export const layerSchema = layerMetadataSchema.extend({
  active: z.boolean().optional(),
  name: z.string().optional(),
  updated_at: z.string(),
  created_at: z.string(),
  extent: z.string(),
  query: z.object({}),
  folder_id: z.string(),
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  type: layerType,
  size: z.number().optional(),
  style: z.object({}).optional(),
  url: z.string().optional(),
  data_type: data_type.optional(),
  legend_urls: z.array(z.string()).optional(),
});

export const getLayersQueryParamsSchema = getContentQueryParamsSchema.extend({
  layer_type: layerType.array().optional(),
  feature_layer_type: featureLayerType.optional(),
});

export const createLayerBaseSchema = layerMetadataSchema.extend({
  folder_id: z.string().uuid(),
});

export const createNewTableLayerSchema = createLayerBaseSchema.extend({
  type: z.literal("table"),
});

export const createNewStandardLayerSchema = createLayerBaseSchema.extend({
  type: z.literal("feature_layer"),
  feature_layer_type: featureLayerType.optional(),
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

export const createNewDatasetLayerSchema = z.object({
  file: z.any(),
  layer_in: z.union([
    createNewTableLayerSchema,
    createNewStandardLayerSchema
  ]),
});

export const layerResponseSchema = responseSchema(layerSchema);
export const layerTypesArray = Object.values(layerType.Values);
export const featureLayerTypesArray = Object.values(featureLayerType.Values);

export type Layer = z.infer<typeof layerSchema>;
export type LayerPaginated = z.infer<typeof layerResponseSchema>;
export type LayerType = z.infer<typeof layerType>;
export type LayerMetadata = z.infer<typeof layerMetadataSchema>;
export type FeatureLayerType = z.infer<typeof featureLayerType>;
export type GetLayersQueryParams = z.infer<typeof getLayersQueryParamsSchema>;
export type CreateNewTableLayer = z.infer<typeof createNewTableLayerSchema>;
export type CreateNewStandardLayer = z.infer<
  typeof createNewStandardLayerSchema
>;
export type CreateNewScenarioLayer = z.infer<
  typeof createNewScenarioLayerSchema
>;
export type CreateNewExternalImageryLayer = z.infer<
  typeof createNewExternalImageryLayerSchema
>;
export type CreateNewExternalTileLayer = z.infer<
  typeof createNewExternalTileLayerSchema
>;
export type CreateNewDatasetLayer = z.infer<typeof createNewDatasetLayerSchema>;
