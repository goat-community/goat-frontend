import * as z from "zod";
import { contentMetadataSchema, getContentQueryParamsSchema } from "@/lib/validations/common";
import { responseSchema } from "@/lib/validations/response";

export const projectSchema = contentMetadataSchema.extend({
  updated_at: z.string(),
  created_at: z.string(),
  folder_id: z.string(),
  id: z.string(),
});

const getProjectsQueryParamsSchema = getContentQueryParamsSchema.extend({});

export const projectResponseSchema = responseSchema(projectSchema);

export type Project = z.infer<typeof projectSchema>;
export type ProjectPaginated = z.infer<typeof projectResponseSchema>;
export type GetProjectsQueryParams = z.infer<
  typeof getProjectsQueryParamsSchema
>;
