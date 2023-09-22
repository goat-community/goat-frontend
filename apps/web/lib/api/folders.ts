import useSWR from "swr";
import { fetcher } from "@/lib/api/fetcher";
import type { GetContentQueryParams } from "@/lib/validations/common";
import type { FolderPaginated } from "@/lib/validations/folder";

export const FOLDERS_API_BASE_URL = new URL(
  "api/v2/folder",
  process.env.NEXT_PUBLIC_API_URL,
).href;

export const useFolders = (queryParams?: GetContentQueryParams) => {
  const { data, isLoading, error, mutate, isValidating } =
    useSWR<FolderPaginated>([`${FOLDERS_API_BASE_URL}`, queryParams], fetcher);
  return {
    folders: data,
    isLoading: isLoading,
    isError: error,
    mutate,
    isValidating,
  };
};

export const deleteFolders = async (id: string) => {
  try {
    await fetch(`${FOLDERS_API_BASE_URL}/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error(error);
    throw Error(`deleteFolder: unable to delete folder with id ${id}`);
  }
};
