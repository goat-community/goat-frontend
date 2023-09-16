import { responseSchema } from "@/lib/validations/response";
import * as z from "zod";
import { paginatedSchema } from "@/lib/validations/common";

export const projectSchema = z.object({
  updated_at: z.string(),
  created_at: z.string(),
  folder_id: z.string(),
  name: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  thumbnail_url: z.string(),
  id: z.string(),
});

export const getProjectQueryParamsSchema = paginatedSchema.extend({
  folder_id: z.string().uuid().optional(),
  search: z.string().optional(),
  authorization: z.string().optional(),
});

export const projectResponseSchema = responseSchema(projectSchema);

export type Project = z.infer<typeof projectSchema>;
export type ProjectPaginated = z.infer<typeof projectResponseSchema>;
export type GetProjectQueryParams = z.infer<typeof getProjectQueryParamsSchema>;
