import * as z from "zod";
import { contentMetadataSchema, getContentQueryParamsSchema } from "@/lib/validations/common";
import { responseSchema } from "@/lib/validations/response";

export const projectSchema = contentMetadataSchema.extend({
  updated_at: z.string(),
  created_at: z.string(),
  folder_id: z.string(),
  id: z.string(),
});

export const projectBaseSchema = z.object({
  folder_id: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  thumbnail_url: z.string().optional(),
});

// they have the same validation but I made them different since we might add some extra things about the layer filter in the project validation
export const projectLayerSchema = projectBaseSchema.extend({
  updated_at: z.string(),
  created_at: z.string(),
  id: z.string(),
  data_source: z.string(),
  extent: z.string(),
  feature_layer_type: z.string(),
  size: z.number(),
  style: z.record(z.unknown()), // You can specify the style schema if needed.
  type: z.string(),
  user_id: z.string(),
});

export const projectInitialViewStateSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  zoom: z.number(),
  min_zoom: z.number(),
  max_zoom: z.number(),
  bearing: z.number(),
  pitch: z.number(),
});

export const postProjectSchema = projectBaseSchema.extend({
  initial_view_state: projectInitialViewStateSchema.optional(),
});

const getProjectsQueryParamsSchema = getContentQueryParamsSchema.extend({});

export const projectResponseSchema = responseSchema(projectSchema);
export const projectLayersResponseSchema = responseSchema(projectLayerSchema);

export type Project = z.infer<typeof projectSchema>;
export type ProjectLayers = z.infer<typeof projectLayerSchema>;
export type ProjectPaginated = z.infer<typeof projectResponseSchema>;
export type PostProject = z.infer<typeof postProjectSchema>;
export type ProjectLayersPaginated = z.infer<typeof projectLayersResponseSchema>;
export type GetProjectsQueryParams = z.infer<
  typeof getProjectsQueryParamsSchema
>;
