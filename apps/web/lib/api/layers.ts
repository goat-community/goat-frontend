import useSWR from "swr";
import { fetchWithAuth, fetcher } from "@/lib/api/fetcher";
import type { GetContentQueryParams } from "@/lib/validations/common";
import type {
  CreateFeatureLayer,
  LayerPaginated,
} from "@/lib/validations/layer";

export const LAYERS_API_BASE_URL = new URL(
  "api/v2/layer",
  process.env.NEXT_PUBLIC_API_URL,
).href;

export const LAYER_KEYS_API_BASE_URL = new URL(
  "collections",
  process.env.NEXT_PUBLIC_GEOAPI_URL,
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
    await fetchWithAuth(`${LAYERS_API_BASE_URL}/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error(error);
    throw Error(`deleteLayer: unable to delete project with id ${id}`);
  }
};

export const createInternalLayer = async (payload: CreateFeatureLayer) => {
  const response = await fetchWithAuth(`${LAYERS_API_BASE_URL}/internal`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to create internal layer");
  }
  return await response.json();
};

export const layerFileUpload = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetchWithAuth(`${LAYERS_API_BASE_URL}/file-upload`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    throw new Error("Failed to upload folder");
  }
  return await response.json();
};

export const useLayerKeys = (layerId: string) => {
  const { data, isLoading, error } = useSWR<LayerPaginated>(
    [`${LAYER_KEYS_API_BASE_URL}/${layerId}/queryables`],
    fetcher,
  );
  return { data, isLoading, error };
};

export const useUniqueValues = (layerId: string, column: string) => {
  const { data, isLoading, error } = useSWR<LayerPaginated>(
    [`${LAYERS_API_BASE_URL}/${layerId}/unique-values/${column}`],
    fetcher,
  );
  return { data, isLoading, error };
};

export const getUniqueValues = async (layerId: string, column: string) => {
  const response = await fetchWithAuth(`${LAYERS_API_BASE_URL}/${layerId}/unique-values/${column}`, {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("Failed to upload folder");
  }
  return await response.json();
}
