import * as z from "zod";

const regionEnum = z.enum(["EU"]);

const organizationBaseSchema = z.object({
  name: z.string().min(1).max(50),
  type: z.string().min(1).max(50),
  size: z.string().min(1).max(50),
  industry: z.string().min(1).max(150),
  department: z.string().min(1).max(150),
  use_case: z.string().min(1).max(250),
  phone_number: z.string().min(1).max(50),
  location: z.string().min(1).max(50),
  newsletter_subscribe: z.boolean(),
});

const organizationSchema = organizationBaseSchema.extend({
  id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  used_storage: z.number(),
  total_storage: z.number(),
  geocoding_quota: z.number(),
  on_trial: z.boolean(),
  region: regionEnum,
  contact_user_id: z.string(),
  hubspot_id: z.string(),
  suspended: z.boolean(),
});

export const postOrganizationSchema = organizationBaseSchema.extend({
  region: regionEnum,
});

export type Organization = z.infer<typeof organizationSchema>;
export type PostOrganization = z.infer<typeof postOrganizationSchema>;
