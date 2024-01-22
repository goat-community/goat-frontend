import * as z from "zod";

export const joinBaseSchema = z.object({
  target_layer_project_id: z.number(),
  target_field: z.string().nonempty("Target Field should not be empty"),
  join_layer_project_id: z.number(),
  join_field: z.string().nonempty("Join Field should not be empty"),
  column_statistics: z.object({
    operation: z.string().nonempty("Operation should not be empty"),
    field: z.string().nonempty("Statistic Field should not be empty"),
  }),
});

export type PostJoin = z.infer<typeof joinBaseSchema>;

export const AggregateBaseSchema = z.object({
  source_layer_project_id: z.number(),
  area_type: z.string().nonempty("Area Type should not be empty"),
  aggregation_layer_project_id: z.number().optional(),
  h3_resolution: z.number().optional(),
  column_statistics: z.object({
    operation: z.string().nonempty("Statistic Operation should not be empty"),
    field: z.string().nonempty("Statistic Field should not be empty"),
  }),
  source_group_by_field: z
    .string()
    .array()
    .nonempty("Array should not be empty"),
});

export type PostAggregate = z.infer<typeof AggregateBaseSchema>;
