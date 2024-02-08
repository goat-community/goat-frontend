import * as z from "zod";

const StartingPoint = z
  .object({
    latitude: z.number().array(),
    longitude: z.number().array(),
  })
  .or(
    z.object({
      layer_project_id: z.number().min(1),
    }),
  );

const TraveltimeCost = z
  .object({
    max_traveltime: z.number().min(1).max(45),
    traveltime_step: z.number(),
    speed: z.number().min(1).max(25).optional(),
  })
  .refine((schema) => schema.traveltime_step <= schema.max_traveltime, {
    message: "The steps must be less than or equal to max_distance",
  });

const DistanceCost = z

  .object({
    max_distance: z
      .number()
      .min(50, { message: "Distance should be bigger than 50." })
      .max(20000, { message: "Distance should be smaller than 20000." })
      .multipleOf(50, { message: "Distance should be a multiple of 50." }),
    distance_step: z
      .number()
      .min(50, { message: "Steps should be bigger than 50." })
      .multipleOf(50, { message: "Steps must be a multiple of 50." }),
    speed: z.number().optional(),
  })
  .refine((schema) => schema.distance_step <= schema.max_distance, {
    message: "The steps must be less than or equal to max_distance",
  });

export const IsochroneBaseSchema = z.object({
  starting_points: StartingPoint,
  isochrone_type: z.string(),
  polygon_difference: z.boolean(),
  routing_type: z
    .string()
    .nonempty("Routing should not be empty")
    .or(
      z.object({
        mode: z.array(z.string()),
        egress_mode: z.string(),
        access_mode: z.string(),
      }),
    ),
  travel_cost: z.union([TraveltimeCost, DistanceCost]),
  time_window: z
    .object({
      weekday: z.string(),
      from_time: z.number(),
      to_time: z.number(),
    })
    .optional(),
});

export type StartingPointType = z.infer<typeof StartingPoint>;

export type PostIsochrone = z.infer<typeof IsochroneBaseSchema>;
export type PostPTIsochrone = z.infer<typeof IsochroneBaseSchema>;
