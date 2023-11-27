import * as z from "zod";
import {
  contentMetadataSchema,
  getContentQueryParamsSchema,
} from "@/lib/validations/common";
import { responseSchema } from "@/lib/validations/response";
import { layerSchema } from "@/lib/validations/layer";
import type { AnyLayer as MapLayerStyle } from "react-map-gl";

export const projectSchema = contentMetadataSchema.extend({
  folder_id: z.string(),
  id: z.string(),
  layer_order: z.array(z.number()),
  updated_at: z.string(),
  created_at: z.string(),
});

export const projectLayerSchema = layerSchema.extend({
  id: z.number(),
  folder_id: z.string(),
  query: z.object({}),
  layer_id: z.string().uuid(),
  project_id: z.string().uuid(),
  legend_urls: z.array(z.string()).optional(),
});

export const projectViewStateSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  zoom: z.number().min(0).max(24),
  min_zoom: z.number().min(0).max(24),
  max_zoom: z.number().min(0).max(24),
  bearing: z.number().min(0).max(360),
  pitch: z.number().min(0).max(60),
});

export const postProjectSchema = z.object({
  folder_id: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  thumbnail_url: z.string().optional(),
  initial_view_state: projectViewStateSchema.optional(),
});

const getProjectsQueryParamsSchema = getContentQueryParamsSchema.extend({});

export const projectResponseSchema = responseSchema(projectSchema);
export const projectLayersResponseSchema = responseSchema(projectLayerSchema);

export type Project = z.infer<typeof projectSchema>;
type LayerZod = z.infer<typeof projectLayerSchema>;
export type ProjectLayer = Omit<LayerZod, "properties"> & {
  properties: MapLayerStyle;
};
export type ProjectPaginated = z.infer<typeof projectResponseSchema>;
export type PostProject = z.infer<typeof postProjectSchema>;
export type ProjectViewState = z.infer<typeof projectViewStateSchema>;
export type ProjectLayersPaginated = z.infer<
  typeof projectLayersResponseSchema
>;
export type GetProjectsQueryParams = z.infer<
  typeof getProjectsQueryParamsSchema
>;
