import * as z from "zod";
import { responseSchema } from "@/lib/validations/response";
import { getContentQueryParamsSchema } from "@/lib/validations/common";

const layerType = z.enum([
  "feature_layer",
  "imagery_layer",
  "tile_layer",
  "table",
]);

const featureLayerType = z.enum([
  "standard",
  "indicator",
  "scenario",
  "street_network",
]);

const data_type = z.enum(["wms", "mvt"]);

const layerSchema = z.object({
  updated_at: z.string(),
  created_at: z.string(),
  extent: z.string(),
  folder_id: z.string(),
  name: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  thumbnail_url: z.string(),
  data_source: z.string(),
  data_reference_year: z.number(),
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  type: layerType,
  size: z.number().optional(),
  style: z.object({}).optional(),
  url: z.string().optional(),
  data_type: data_type.optional(),
  legend_urls: z.array(z.string()).optional(),
});

const getLayersQueryParamsSchema = getContentQueryParamsSchema.extend({
  layer_type: layerType.array().optional(),
  feature_layer_type: featureLayerType.optional(),
});

export const layerResponseSchema = responseSchema(layerSchema);
export const layerTypesArray = Object.values(layerType.Values);
export const featureLayerTypesArray = Object.values(featureLayerType.Values);

export type Layer = z.infer<typeof layerSchema>;
export type LayerPaginated = z.infer<typeof layerResponseSchema>;
export type LayerType = z.infer<typeof layerType>;
export type GetLayersQueryParams = z.infer<typeof getLayersQueryParamsSchema>;
