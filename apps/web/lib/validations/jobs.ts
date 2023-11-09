import { paginatedSchema } from "@/lib/validations/common";
import { responseSchema } from "@/lib/validations/response";
import * as z from "zod";

export const msgTypeEnum = z.enum(["info", "warning", "error"]);
export const jobTypeEnum = z.enum(["layer_upload"]);
export const jobStatusTypeEnum = z.enum([
  "pending",
  "running",
  "finished",
  "failed",
  "killed"
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
  status_simple: jobStatusTypeEnum,
  payload: z.record(z.any()).optional(),
  read: z.boolean().optional(),
});

export const getJobsQueryParamsSchema = paginatedSchema.extend({
  job_type: jobTypeEnum.optional(),
  project_id: z.string().uuid().optional(),
  start_data: z.string().optional(),
  read: z.boolean().optional(),
  end_data: z.string().optional(),
  authorization: z.string().optional(),
});

export const jobResponseSchema = responseSchema(jobSchema);

export type JobStatusType = z.infer<typeof jobStatusTypeEnum>;
export type JobType = z.infer<typeof jobTypeEnum>;
export type MsgType = z.infer<typeof msgTypeEnum>;
export type JobStep = z.infer<typeof jobStepSchema>;
export type Job = z.infer<typeof jobSchema>;
export type JobPaginated = z.infer<typeof jobResponseSchema>;
export type GetJobsQueryParam = z.infer<typeof getJobsQueryParamsSchema>;
