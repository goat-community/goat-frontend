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

export const AggregatePolygonSchema = AggregateBaseSchema.extend({
  weigthed_by_intersecting_area: z.boolean(),
});

export const BufferBaseSchema = z
  .object({
    source_layer_project_id: z.number(),
    max_distance: z
      .number()
      .min(50, { message: "Distance should be 50 or more" })
      .multipleOf(50, { message: "Distance should be multiple of 50" }),
    distance_step: z.number(),
    polygon_union: z.boolean(),
    polygon_difference: z.boolean(),
  })
  .refine((schema) => schema.distance_step <= schema.max_distance, {
    message: "The steps must be less than or equal to max_distance",
  });

const timeWindowSchema = z.object({
  weekday: z
    .string()
    .refine((value) => ["weekday", "saturday"].includes(value.toLowerCase()), {
      message: "Invalid weekday. Must be one of: weekday, saturday",
    }),
  from_time: z.number(),
  to_time: z.number(),
});

const stationConfigSchema = z.object({
  groups: z.record(z.string()),
  time_frequency: z.array(z.number()),
  categories: z.array(z.record(z.number())),
  classification: z.record(z.record(z.string())),
});

export const accessibilityIndicatorBaseSchema = z.object({
  time_window: timeWindowSchema,
  reference_area_layer_project_id: z.number(),
  station_config: stationConfigSchema,
});

export const originDestinationBaseSchema = z.object({
  geometry_layer_project_id: z.number().positive("Layer invalid."),
  origin_destination_matrix_layer_project_id: z
    .number()
    .positive("Layer invalid."),
  unique_id_column: z.string().nonempty("Unique Id Column should not be empty"),
  origin_column: z.string().nonempty("Origin Column should not be empty"),
  destination_column: z
    .string()
    .nonempty("Destination Column should not be empty"),
  weight_column: z.string().nonempty("Weight Column should not be empty"),
});

export type PostAggregate = z.infer<typeof AggregateBaseSchema>;
export type PostAggregatePolygon = z.infer<typeof AggregatePolygonSchema>;
export type PostBuffer = z.infer<typeof BufferBaseSchema>;
export type PostOevGuetenKlassen = z.infer<
  typeof accessibilityIndicatorBaseSchema
>;
export type PostTripCountStation = z.infer<
  typeof accessibilityIndicatorBaseSchema
>;
export type PostOriginDestination = z.infer<typeof originDestinationBaseSchema>;
