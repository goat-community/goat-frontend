import useSWR from "swr";
import { fetcher } from "@/lib/api/fetcher";
import type { GetContentQueryParams } from "@/lib/validations/common";
import type { LayerPaginated } from "@/lib/validations/layer";

export const LAYERS_API_BASE_URL = new URL(
  "api/v2/layer",
  process.env.NEXT_PUBLIC_API_URL,
).href;

export const useLayers = (queryParams?: GetContentQueryParams) => {
  const { data, isLoading, error, mutate, isValidating } =
    useSWR<LayerPaginated>([`${LAYERS_API_BASE_URL}`, queryParams], fetcher);
  return {
    layers: data,
    isLoading: isLoading,
    isError: error,
    mutate,
    isValidating,
  };
};

export const deleteLayer = async (id: string) => {
  try {
    await fetch(`${LAYERS_API_BASE_URL}/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error(error);
    throw Error(`deleteLayer: unable to delete project with id ${id}`);
  }
};
