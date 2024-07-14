import * as z from "zod";

import { responseSchema } from "@/lib/validations/response";

export const scenarioSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  user_id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const postScenarioSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
});

export const scenarioResponseSchema = responseSchema(scenarioSchema);

export const scenarioEditTypeEnum = z.enum(["n", "m", "d"]);

export const scenarioFeaturesPropertiesSchema = z
  .object({
    id: z.string(),
    layer_id: z.string(),
    feature_id: z.number(),
    edit_type: scenarioEditTypeEnum,
  })
  .catchall(z.unknown());

export const scenarioFeatureSchema = z.object({
  type: z.string(),
  properties: scenarioFeaturesPropertiesSchema,
});

export const geometrySchema = z.object({
  type: z.string(),
  coordinates: z.array(z.unknown()),
});

export const scenarioFeatures = z.object({
  type: z.string(),
  id: z.string(),
  geometry: geometrySchema,
  features: z.array(scenarioFeatureSchema),
});

export const postScenarioFeatureSchema = z.object({
  id: z.number(),
  layer_id: z.string(),
  edit_type: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Scenario = z.infer<typeof scenarioSchema>;
export type ScenarioResponse = z.infer<typeof scenarioResponseSchema>;
export type ScenarioFeatures = z.infer<typeof scenarioFeatures>;
export type PostScenario = z.infer<typeof postScenarioSchema>;
export type PostScenarioFeature = z.infer<typeof postScenarioFeatureSchema>;
