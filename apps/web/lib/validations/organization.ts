import * as z from "zod";

import { invitationStatusEnum } from "@/lib/validations/invitation";

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
  avatar: z.string(),
});

const organizationSchema = organizationBaseSchema.extend({
  id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  used_storage: z.number(),
  used_geocoding_quota: z.number(),
  on_trial: z.boolean(),
  region: regionEnum,
  contact_user_id: z.string(),
  hubspot_id: z.string(),
  suspended: z.boolean(),
});

const organizationMemberSchema = z.object({
  id: z.string(),
  email: z.string(),
  roles: z.array(z.string()),
  invitation_status: invitationStatusEnum,
  avatar: z.string(),
});

export const invitationCreateSchema = z.object({
  user_email: z.string().email(),
  role: z.enum(["admin", "member"]),
  subscription_id: z.string().uuid().optional(),
  expires: z.string().optional(),
});

export const organizationUpdateSchema = organizationBaseSchema.partial();

export const postOrganizationSchema = organizationBaseSchema.extend({
  region: regionEnum,
  newsletter_subscribe: z.boolean(),
});

export type Organization = z.infer<typeof organizationSchema>;
export type OrganizationMember = z.infer<typeof organizationMemberSchema>;
export type OrganizationUpdate = z.infer<typeof organizationUpdateSchema>;
export type InvitationCreate = z.infer<typeof invitationCreateSchema>;
export type PostOrganization = z.infer<typeof postOrganizationSchema>;
