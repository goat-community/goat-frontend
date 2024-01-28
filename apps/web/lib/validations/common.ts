import * as z from "zod";

export const orderByEnum = z.enum(["ascendent", "descendent"]);

export const paginatedSchema = z.object({
  order_by: z.string().optional(),
  order: orderByEnum.optional(),
  page: z.number().int().positive().optional(),
  size: z.number().int().positive().optional(),
});

export const getContentQueryParamsSchema = paginatedSchema.extend({
  folder_id: z.string().uuid().optional(),
  search: z.string().optional(),
  authorization: z.string().optional(),
});

export const contentMetadataSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  thumbnail_url: z.string().url().optional(),
});

export const layerType = z.enum([
  "feature",
  "external_imagery",
  "external_vector_tile",
  "table",
]);

export const featureLayerType = z.enum([
  "standard",
  "indicator",
  "scenario",
  "street_network",
]);

export const tableDataExchangeType = z.enum(["csv", "xlsx"]);
export const featureDataExchangeType = z.enum([
  "csv",
  "xlsx",
  "geojson",
  "gpkg",
  "kml",
  "shp",
]);

export const featureDataExchangeCRS = z.enum([
  "4326",
  "3857",
  "4258",
  "27700",
  "4269",
]);

export const featureLayerGeometryType = z.enum(["point", "line", "polygon"]);

export const data_type = z.enum(["wms", "mvt"]);

export type LayerType = z.infer<typeof layerType>;
export type FeatureLayerGeometryType = z.infer<typeof featureLayerGeometryType>;
export type TableDataExchangeType = z.infer<typeof tableDataExchangeType>;
export type FeatureDataExchangeType = z.infer<typeof featureDataExchangeType>;
export type GetContentQueryParams = z.infer<typeof getContentQueryParamsSchema>;
