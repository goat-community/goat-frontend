import useSWR from "swr";
import { fetcher } from "@/lib/api/fetcher";
import type {
  GetProjectQueryParams,
  ProjectPaginated,
} from "@/lib/validations/project";

export const PROJECTS_API_BASE_URL = new URL(
  "api/v2/project",
  process.env.NEXT_PUBLIC_API_URL,
).href;

export const useProjects = (queryParams?: GetProjectQueryParams) => {
  const { data, isLoading, error, mutate, isValidating } =
    useSWR<ProjectPaginated>(
      [`${PROJECTS_API_BASE_URL}`, queryParams],
      fetcher,
    );
  return {
    projects: data,
    isLoading: isLoading,
    isError: error,
    mutate,
    isValidating,
  };
};
