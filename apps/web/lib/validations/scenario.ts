import { responseSchema } from "@/lib/validations/response";
import * as z from "zod";

export const scenarioSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  user_id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
})

export const postScenarioSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
})

export const scenarioResponseSchema = responseSchema(scenarioSchema)

export const postScenarioFeatureSchema = z.object({
  id: z.number(),
  layer_id: z.string(),
  edit_type: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
})


export type Scenario = z.infer<typeof scenarioSchema>;
export type ScenarioResponse = z.infer<typeof scenarioResponseSchema>;
export type PostScenario = z.infer<typeof postScenarioSchema>;
export type PostScenarioFeature = z.infer<typeof postScenarioFeatureSchema>;
