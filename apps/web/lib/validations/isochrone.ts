import * as z from "zod";

const StartingPoint = z
  .object({
    latitude: z.string().array(),
    // .nonempty("Starting point should not be empty"),
    longitude: z
      .string()
      .array()
      // .nonempty("Starting point should not be empty"),
  })
  .or(
    z.object({
      layer_id: z.string().nonempty("Starting point should not be empty"),
    }),
  );

const TraveltimeCost = z.object({
  max_traveltime: z.number().min(1).max(45),
  traveltime_step: z
    .number()
    .refine((value) => value !== 0 && value % 50 === 0, {
      message: "The steps must be a multiple of 50",
    }),
  speed: z.number().min(1).max(25).optional(),
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
      .refine((value) => value !== 0 && value % 50 === 0, {
        message: "Steps must be a multiple of 50",
      }),
    speed: z.number().optional(),
  })
  // .transform((data) => {
  //   if (data.distance_step > data.max_distance) {
  //     throw new Error("distance_step must be less than or equal to max_distance");
  //   }
  //   return data;
  // })
  .refine((schema) => schema.distance_step <= schema.max_distance, {
    message: "The steps must be less than or equal to max_distance",
  });

export const IsochroneBaseSchema = z.object({
  starting_points: StartingPoint,
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
  // travel_cost: TraveltimeCost.or(DistanceCost),
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
