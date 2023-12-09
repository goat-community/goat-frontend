import * as z from "zod";

const StartingPoint = z
  .object({
    latitude: z.array(z.number()),
    longitude: z.array(z.number()),
  })
  .or(
    z.object({
      layer_id: z.string(),
    }),
  );

const TraveltimeCost = z
  .object({
    max_traveltime: z.number(),
    traveltime_step: z.number(),
    speed: z.number().optional(),
  })
  .refine((schema) => {
    return !(
      schema.traveltime_step <= schema.max_traveltime
    );
  });

const DistanceCost = z.object({
  max_distance: z.number(),
  distance_step: z.number(),
  speed: z.number().optional(),
}).refine((schema) => {
  return !(
    schema.distance_step <= schema.max_distance
  );
});

export const IsochroneBaseSchema = z.object({
  starting_points: StartingPoint,
  routing_type: z.string().or(
    z.object({
      mode: z.array(z.string()),
      egress_mode: z.string(),
      access_mode: z.string(),
    }),
  ),
  travel_cost: TraveltimeCost.or(DistanceCost),
  time_window: z
    .object({
      weekday: z.string(),
      from_time: z.number(),
      to_time: z.number(),
    })
    .optional(),
  result_target: z.object({
    layer_name: z.string(),
    folder_id: z.string(),
    project_id: z.string().optional(),
  }),
});

export const IsochronePTSchema = z.object({
  starting_points: z
    .object({
      latitude: z.array(z.number()),
      longitude: z.array(z.number()),
    })
    .or(
      z.object({
        layer_id: z.string(),
      }),
    ),
  routing_type: z.object({
    mode: z.array(z.string()),
    egress_mode: z.string(),
    access_mode: z.string(),
  }),
  travel_cost: z
    .object({
      max_traveltime: z.number(),
      traveltime_step: z.number(),
      speed: z.number().optional(),
    })
    .or(
      z.object({
        max_distance: z.number(),
        distance_step: z.number(),
      }),
    ),
  time_window: z
    .object({
      weekday: z.string(),
      from_time: z.number(),
      to_time: z.number(),
    })
    .optional(),
  result_target: z.object({
    layer_name: z.string(),
    folder_id: z.string(),
    project_id: z.string().optional(),
  }),
});

export type StartingPointType = z.infer<typeof StartingPoint>;

export type PostIsochrone = z.infer<typeof IsochroneBaseSchema>;
export type PostPTIsochrone = z.infer<typeof IsochroneBaseSchema>;
