import * as z from "zod";

export const joinBaseSchema = z.object({
  target_layer_project_id: z.number(),
  target_field: z.string(),
  join_layer_project_id: z.number(),
  join_field: z.string(),
  column_statistics: z.object({
    operation: z.string(),
    field: z.string()
  }),
  layer_name: z.string()
});

export type PostJoin = z.infer<typeof joinBaseSchema>;

export const AggregateBaseSchema = z.object({
  point_layer_project_id: z.number(),
  area_type: z.string(),
  area_layer_id: z.string().optional(),
  h3_resolution: z.number().optional(),
  column_statistics: z.object({
    operation: z.string(),
    field: z.string()
  }),
  area_group_by_field: z.array(z.string()).optional(),
  layer_name: z.string()
});

export type PostAggregate = z.infer<typeof AggregateBaseSchema>;