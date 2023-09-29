import useSWR from "swr";
import { fetcher } from "@/lib/api/fetcher";
import type { ProjectPaginated, ProjectLayers, Project } from "@/lib/validations/project";
import type { GetContentQueryParams } from "@/lib/validations/common";

export const PROJECTS_API_BASE_URL = new URL(
  "api/v2/project",
  process.env.NEXT_PUBLIC_API_URL,
).href;

export const useProjects = (queryParams?: GetContentQueryParams) => {
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

export const useProject = (id: string) => {
  const { data, isLoading, error, mutate, isValidating } =
    useSWR<Project>(
      [`${PROJECTS_API_BASE_URL}/${id}`],
      fetcher,
    );
  return {
    project: data,
    isLoading: isLoading,
    isError: error,
    mutate,
    isValidating,
  };
}

export const getProjectLayers = async (id: string) => {
  try {
    const data: Promise<ProjectLayers[]> = (await fetch(`${PROJECTS_API_BASE_URL}/${id}/layer`)).json();
    return data;
  }
  catch (error) {
    console.error(error);
    throw Error(`error: make sure you are connected to an internet connection!`)
  }
}

export const deleteProject = async (id: string) => {
  try {
    await fetch(`${PROJECTS_API_BASE_URL}/${id}`, {
      method: "DELETE",
    });
  }
  catch (error) {
    console.error(error);
    throw Error(`deleteProject: unable to delete project with id ${id}`)
  }
}

