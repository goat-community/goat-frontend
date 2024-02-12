import * as z from "zod";

//**=== CATCHMENT AREA === */
export const CatchmentAreaRoutingTypeEnum = z.enum([
  "walking",
  "bicycle",
  "pedelec",
  "car_peak",
  "pt",
]);

export const CatchmentAreaRoutingWithoutPT = z.enum([
  "walking",
  "bicycle",
  "pedelec",
  "car",
]);

export const PTRoutingModes = z.enum([
  "bus",
  "tram",
  "rail",
  "subway",
  "ferry",
  "cable_car",
  "gondola",
  "funicular",
]);

export const catchmentAreaShapeEnum = z.enum([
  "polygon",
  "network",
  "rectangular_grid",
]);

export const PTDay = z.enum(["weekday", "saturday", "sunday"]);

export const PTAccessModes = z.enum(["walk"]);
export const PTEgressModes = z.enum(["walk"]);

export const catchmentAreaMaskLayerNames = {
  active_mobility: "user_data.aadde6e924f84fa3b9d03fd1a71e4ab9",
  pt: "user_data.6792ca7c9b5e4845bae8c2d4c8b1de1e",
};
export const catchmentAreaConfigDefaults: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [k in CatchmentAreaRoutingType]: any;
} = {
  walking: {
    speed: 5,
    max_travel_time: 15,
    max_distance: 500,
    steps: 5,
  },
  bicycle: {
    speed: 15,
    max_travel_time: 15,
    max_distance: 500,
    steps: 5,
  },
  pedelec: {
    speed: 23,
    max_travel_time: 15,
    max_distance: 500,
    steps: 5,
  },
  car_peak: {
    speed: 25,
    max_travel_time: 15,
    max_distance: 500,
    steps: 5,
  },
  pt: {
    start_time: 25200,
    end_time: 32400,
    access_mode: PTAccessModes.Enum.walk,
    egress_mode: PTEgressModes.Enum.walk,
    max_travel_time: 30,
    steps: 5
  },
};

export const PTRoutingEgressModes = z.enum(["walk"]);

export const PTRoutingAccessModes = z.enum(["walk"]);

export const PTRouting = z.object({
  mode: z.array(PTRoutingModes),
  egress_mode: PTRoutingEgressModes,
  access_mode: PTRoutingAccessModes,
});

export const startingPointMapSchema = z.object({
  latitude: z.number().array(),
  longitude: z.number().array(),
});

export const startingPointLayerSchema = z.object({
  layer_project_id: z.number().min(1),
});

export const startingPointSchema = z.union([
  startingPointMapSchema,
  startingPointLayerSchema,
]);

export const timeTravelCost = z.object({
  max_traveltime: z.number().min(1).max(45),
  traveltime_step: z.number().min(1).max(45),
  speed: z.number().min(1).max(25).optional(),
});

export const distanceTravelCost = z.object({
  max_distance: z.number().min(50).max(20000),
  distance_step: z.number().min(50).max(20000),
});

export const ptTimeWindow = z.object({
  from_time: z.number().min(0).max(86400),
  to_time: z.number().min(0).max(86400),
  weekday: z.string(),
});
export const catchmentAreaBaseSchema = z.object({
  isochrone_type: catchmentAreaShapeEnum.default("polygon"),
  starting_points: startingPointSchema,
  polygon_difference: z.boolean(),
});

export const activeMobilityAndCarCatchmentAreaSchema =
  catchmentAreaBaseSchema.extend({
    routing_type: CatchmentAreaRoutingWithoutPT,
    travel_cost: z.union([timeTravelCost, distanceTravelCost]),
  });

export const ptCatchmentAreaSchema = catchmentAreaBaseSchema.extend({
  routing_type: PTRouting,
  travel_cost: timeTravelCost,
  time_window: ptTimeWindow,
});

export type CatchmentAreaRoutingType = z.infer<
  typeof CatchmentAreaRoutingTypeEnum
>;
export type CatchmentAreaRoutingWithoutPTType = z.infer<
  typeof CatchmentAreaRoutingWithoutPT
>;
export type PTRoutingModesType = z.infer<typeof PTRoutingModes>;
export type PTRoutingEgressModesType = z.infer<typeof PTRoutingEgressModes>;
export type PTRoutingAccessModesType = z.infer<typeof PTRoutingAccessModes>;
export type PTRoutingType = z.infer<typeof PTRouting>;
export type PostActiveMobilityAndCarCatchmentArea = z.infer<
  typeof activeMobilityAndCarCatchmentAreaSchema
>;
export type PostPTCatchmentArea = z.infer<typeof ptCatchmentAreaSchema>;

//**=== JOIN === */
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
    source_layer_project_id: z
      .number()
      .min(1, { message: "Source Layer should not be empty." }),
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
  geometry_layer_project_id: z.number(),
  origin_destination_matrix_layer_project_id: z.number(),
  // .positive("Layer invalid."),
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
