import * as z from "zod";

const regionEnum = z.enum(["eu"]);

const organizationSchema = z.object({
  id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  name: z.string(),
  image_url: z.string().url(),
  used_storage: z.number(),
  total_storage: z.number(),
  geocoding_quota: z.number(),
  on_trial: z.boolean(),
  region: regionEnum,
  contact_user_id: z.string(),
  hubspot_id: z.string(),
  suspended: z.boolean(),
});

export const postOrganizationSchema = z.object({
  name: z.string().min(1).max(50),
  region: regionEnum,
});

export type Organization = z.infer<typeof organizationSchema>;
export type PostOrganization = z.infer<typeof postOrganizationSchema>;
