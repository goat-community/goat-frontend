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
  "car_peak",
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
    steps: 5,
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
  max_traveltime: z.number().min(1).max(60),
  steps: z.number().min(1).max(9),
  speed: z.number().min(1).max(25).optional(),
});

export const distanceTravelCost = z.object({
  max_distance: z.number().min(50).max(20000),
  steps: z.number().min(3).max(9),
});

export const ptTimeWindow = z.object({
  weekday: z.string(),
  from_time: z.number().min(0).max(86400),
  to_time: z.number().min(0).max(86400),
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

//**=== OEV-GUETEKLASSEN + TRIP COUNT === */
const stationConfigSchema = z.object({
  groups: z.record(z.string()),
  time_frequency: z.array(z.number()),
  categories: z.array(z.record(z.number())),
  classification: z.record(z.record(z.string())),
});

export const tripCountSchema = z.object({
  time_window: ptTimeWindow,
  reference_area_layer_project_id: z.number(),
  station_config: stationConfigSchema,
});

export const oevGueteklassenSchema = tripCountSchema.extend({});

export type PostTripCount = z.infer<typeof tripCountSchema>;
export type PostOevGueteKlassen = z.infer<typeof oevGueteklassenSchema>;

//**=== JOIN === */
export const statisticOperationEnum = z.enum([
  "count",
  "sum",
  "mean",
  "median",
  "min",
  "max",
]);

export const joinSchema = z.object({
  target_layer_project_id: z.number(),
  target_field: z.string(),
  join_layer_project_id: z.number(),
  join_field: z.string(),
  column_statistics: z.object({
    operation: statisticOperationEnum,
    field: z.string(),
  }),
});

export type PostJoin = z.infer<typeof joinSchema>;

//**=== BUFFER === */
export const bufferDefaults = {
  min_distance: 50,
  max_distance: 5000,
  default_distance: 500,
  buffer_step: 50,
  default_steps: 1,
  polygon_union: true,
  polygon_difference: false,
};

export const bufferSchema = z.object({
  source_layer_project_id: z.number(),
  max_distance: z.number().min(50).multipleOf(50),
  distance_step: z.number(),
  polygon_union: z.boolean(),
  polygon_difference: z.boolean(),
});

export type PostBuffer = z.infer<typeof bufferSchema>;

//**=== AGGREGATE === */
export const areaTypeEnum = z.enum(["h3_grid", "feature"]);

export const aggregatePointSchema = z.object({
  source_layer_project_id: z.number(),
  area_type: areaTypeEnum,
  aggregation_layer_project_id: z.number().optional(),
  h3_resolution: z.number().optional(),
  column_statistics: z.object({
    operation: statisticOperationEnum,
    field: z.string(),
  }),
  source_group_by_field: z.string().array().optional(),
});

export const aggregatePolygonSchema = aggregatePointSchema.extend({
  weigthed_by_intersecting_area: z.boolean().default(false),
});

export type PostAggregatePoint = z.infer<typeof aggregatePointSchema>;
export type PostAggregatePolygon = z.infer<typeof aggregatePolygonSchema>;

//**=== ORIGIN DESTINATION MATRIX ===
export const originDestinationMatrixSchema = z.object({
  geometry_layer_project_id: z.number(),
  origin_destination_matrix_layer_project_id: z.number(),
  unique_id_column: z.string(),
  origin_column: z.string(),
  destination_column: z.string(),
  weight_column: z.string(),
});

export type PostOriginDestinationMatrix = z.infer<
  typeof originDestinationMatrixSchema
>;

//**=== NEARBY STATIONS ===
export const nearbyStationsRoutingTypeEnum = z.enum([
  "walking",
  "bicycle",
  "pedelec",
]);

export const nearbyStationsSchema = z.object({
  starting_points: startingPointSchema,
  access_mode: nearbyStationsRoutingTypeEnum,
  speed: z.number().min(1).max(25),
  max_traveltime: z.number().min(1).max(15),
  mode: z.array(PTRoutingModes),
  time_window: ptTimeWindow,
});

export type PostNearbyStations = z.infer<typeof nearbyStationsSchema>;
