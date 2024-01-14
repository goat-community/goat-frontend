import * as z from "zod";

export const updateLayerFilters = z.object({
  query: z.object({}),
});

export const expression = z.object({
  attribute: z.string(),
  expression: z.string(),
  value: z.string().or(z.number()),
  id: z.string(),
});

export const layerFilters = z.object({
  expressions: z.object({}),
});

export type UpdateFilterRequestBody = z.infer<typeof updateLayerFilters>;
export type LayerExpressions = z.infer<typeof layerFilters>;
export type Expression = z.infer<typeof expression>;
