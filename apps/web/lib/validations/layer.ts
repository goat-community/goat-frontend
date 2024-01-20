import * as z from "zod";
import { responseSchema } from "@/lib/validations/response";
import {
  contentMetadataSchema,
  data_type,
  featureLayerType,
  getContentQueryParamsSchema,
  layerType,
} from "@/lib/validations/common";
import type { AnyLayer as MapLayerStyle } from "react-map-gl";

export const layerMetadataSchema = contentMetadataSchema.extend({
  data_source: z.string().optional(),
  data_reference_year: z.number().optional(),
});

const layerFieldType = z.object({
  name: z.string(),
  type: z.union([z.literal("string"), z.literal("number")]),
});

export const layerSchema = layerMetadataSchema.extend({
  id: z.string(),
  properties: z.object({}),
  total_count: z.number().optional(),
  extent: z.string(),
  folder_id: z.string(),
  user_id: z.string().uuid(),
  type: layerType,
  size: z.number().optional(),
  other_properties: z.object({}).optional(),
  url: z.string().optional(),
  feature_layer_type: featureLayerType.optional(),
  feature_layer_geometry_type: z.string(),
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

export const layerResponseSchema = responseSchema(layerSchema);
export const layerTypesArray = Object.values(layerType.Values);
export const featureLayerTypesArray = Object.values(featureLayerType.Values);

export type LayerZod = z.infer<typeof layerSchema>;
export type Layer = Omit<LayerZod, "properties"> & {
  properties: MapLayerStyle;
};
export type LayerPaginated = z.infer<typeof layerResponseSchema>;
export type LayerType = z.infer<typeof layerType>;
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
