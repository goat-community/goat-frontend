import { paginatedSchema } from "@/lib/validations/common";
import { inviationQueryParams } from "@/lib/validations/invitation";
import * as z from "zod";

export const getInvitationsQueryParamsSchema = z
  .object({})
  .merge(paginatedSchema)
  .merge(inviationQueryParams);

export const userSchemaBase = z.object({
  email: z.string().email(),
  avatar: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  newsletter_subscribe: z.boolean().nullable().optional().default(false),
  roles: z.array(z.string()).optional().default([]),
});

export const userSchema = userSchemaBase.extend({
  organization_id: z.string(),
  id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  enabled: z.boolean(),
  topt: z.boolean(),
});

export const userSchemaUpdate = userSchemaBase.partial();

export type GetInvitationsQueryParams = z.infer<
  typeof getInvitationsQueryParamsSchema
>;
export type User = z.infer<typeof userSchema>;
export type UserUpdate = z.infer<typeof userSchemaUpdate>;
export type UserBase = z.infer<typeof userSchemaBase>;
