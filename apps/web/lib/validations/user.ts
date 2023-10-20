import { paginatedSchema } from "@/lib/validations/common";
import { inviationQueryParams } from "@/lib/validations/invitation";
import * as z from "zod";

export const getInvitationsQueryParamsSchema = z
  .object({})
  .merge(paginatedSchema)
  .merge(inviationQueryParams);


export type GetInvitationsQueryParams = z.infer<typeof getInvitationsQueryParamsSchema>;