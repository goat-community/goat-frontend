import { jobSchema, type Job } from "@/lib/validations/jobs";

export const JOBS_API_BASE_URL = new URL(
  "api/v2/job",
  process.env.NEXT_PUBLIC_API_URL,
).href;

export const getJob = async (id: string): Promise<Job> => {
  const response = await fetch(`${JOBS_API_BASE_URL}/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to delete folder");
  }
  const json = await response.json();
  const parsed = jobSchema.safeParse(json);
  if (!parsed.success) {
    throw new Error("Failed to parse job");
  }

  return parsed.data;
};
