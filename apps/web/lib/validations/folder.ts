import * as z from "zod";
import { responseSchema } from "@/lib/validations/response";

export const folderSchema = z.object({
  name: z.string(),
  id: z.string().uuid(),
  user_id: z.string().uuid()
});



export const folderResponseSchema = responseSchema(folderSchema);

export type Folder = z.infer<typeof folderSchema>;
export type FolderPaginated = z.infer<typeof folderResponseSchema>;
