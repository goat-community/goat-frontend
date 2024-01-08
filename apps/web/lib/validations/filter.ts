import * as z from "zod";

export const updateLayerFilters = z.object({
  query: z.object({}),
});

export const expression = z.object({
  attribute: z.string(),
  expression: z.string(),
  value: z.string().or(z.number()),
});

export const layerFilters = z.object({
  expressions: z.array(expression),
});

export type UpdateFilterRequestBody = z.infer<typeof updateLayerFilters>;
export type LayerExpressions = z.infer<typeof layerFilters>;
