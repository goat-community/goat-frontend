import * as z from "zod";

export const msgTypeEnum = z.enum(["info", "warning", "error"]);
export const jobTypeEnum = z.enum(["layer_upload"]);
export const jobStatusTypeEnum = z.enum([
  "pending",
  "running",
  "finished",
  "failed",
]);

export const msgSchema = z.object({
  type: msgTypeEnum,
  msg: z.string(),
});

const jobStepSchema = z.object({
  status: jobStatusTypeEnum.optional(),
  timestamp_start: z.date().nullable(),
  timestamp_end: z.date().nullable(),
  msg: msgSchema.optional(),
});

const jobStatusLayerUpload = z.object({
  validation: jobStepSchema.optional(),
  upload: jobStepSchema.optional(),
  migration: jobStepSchema.optional(),
});

export const jobSchema = z.object({
  updated_at: z.string(),
  created_at: z.string(),
  id: z.string().uuid(),
  type: jobTypeEnum,
  status: jobStatusLayerUpload,
  payload: z.record(z.any()).optional(),
});


export type JobStatusType = z.infer<typeof jobStatusTypeEnum>;
export type JobType = z.infer<typeof jobTypeEnum>;
export type MsgType = z.infer<typeof msgTypeEnum>;
export type JobStep = z.infer<typeof jobStepSchema>;
export type Job = z.infer<typeof jobSchema>;
