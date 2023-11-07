import * as z from "zod";

export const joinBaseSchema = z.object({
  target_layer_id: z.string(),
  target_field: z.string(),
  join_layer_id: z.string(),
  join_field: z.string(),
  column_statistics: z.object({
    operation: z.string(),
    field: z.string()
  }),
  result_target: z.object({
    layer_name: z.string(),
    folder_id: z.string(),
    project_id: z.string(),
  })
});

export type PostJoin = z.infer<typeof joinBaseSchema>;

export const AggregateBaseSchema = z.object({
  point_layer_id: z.string(),
  area_type: z.string(),
  area_layer_id: z.string().optional(),
  h3_resolution: z.number().optional(),
  column_statistics: z.object({
    operation: z.string(),
    field: z.string()
  }),
  area_group_by_field: z.array(z.string()).optional(),
  result_target: z.object({
    layer_name: z.string(),
    folder_id: z.string(),
    project_id: z.string(),
  })
});

export type PostAggregate = z.infer<typeof AggregateBaseSchema>;