"use client";

import useSWR from "swr";
import { fetchWithAuth, fetcher } from "@/lib/api/fetcher";
import type {
  ProjectPaginated,
  Project,
  PostProject,
} from "@/lib/validations/project";
import type { GetContentQueryParams } from "@/lib/validations/common";
import type { Layer } from "@/lib/validations/layer";

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
  const { data, isLoading, error, mutate, isValidating } = useSWR<Project>(
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
};

export const createProject = async (
  payload: PostProject,
): Promise<Project> => {
  const response = await fetchWithAuth(`${PROJECTS_API_BASE_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error("Failed to create project");
  }
  return await response.json();
};


export const getProjectLayers = async (id: string) => {
  try {
    const data: Promise<Layer[]> = (
      await fetchWithAuth(`${PROJECTS_API_BASE_URL}/${id}/layer`)
    ).json();
    return data;
  } catch (error) {
    console.error(error);
    throw Error(
      `error: make sure you are connected to an internet connection!`,
    );
  }
};

export const deleteProject = async (id: string) => {
  try {
    await fetchWithAuth(`${PROJECTS_API_BASE_URL}/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error(error);
    throw Error(`deleteProject: unable to delete project with id ${id}`);
  }
};
