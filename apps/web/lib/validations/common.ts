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

export type GetContentQueryParams = z.infer<typeof getContentQueryParamsSchema>;