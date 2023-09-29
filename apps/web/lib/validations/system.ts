import * as z from "zod";

const clientThemeEnum = z.enum(["dark", "light"]);
const preferredLanguageEnum = z.enum(["en", "de"]);
const unitEnum = z.enum(["metric", "imperial"]);

export const systemSettingsSchemaBase = z.object({
  client_theme: clientThemeEnum,
  preferred_language: preferredLanguageEnum,
  unit: unitEnum,
  user_id: z.string(),
});

export const systemSettingsSchema = systemSettingsSchemaBase.extend({
  updated_at: z.string(),
  created_at: z.string(),
  id: z.string(),
});

export const systemSettingsSchemaUpdate = systemSettingsSchemaBase.partial();

export type SystemSettingsSchema = z.infer<typeof systemSettingsSchema>;
export type SystemSettingsSchemaUpdate = z.infer<
  typeof systemSettingsSchemaUpdate
>;
export type SystemSettingsSchemaBase = z.infer<typeof systemSettingsSchemaBase>;
