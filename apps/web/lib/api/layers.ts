import useSWR from "swr";
import { fetchWithAuth, fetcher } from "@/lib/api/fetcher";
import type { GetContentQueryParams } from "@/lib/validations/common";
import type {
  ClassBreaks,
  CreateFeatureLayer,
  LayerClassBreaks,
  LayerPaginated,
  LayerQueryables,
} from "@/lib/validations/layer";

export const LAYERS_API_BASE_URL = new URL(
  "api/v2/layer",
  process.env.NEXT_PUBLIC_API_URL,
).href;

export const COLLECTIONS_API_BASE_URL = new URL(
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

export const useLayerQueryables = (layerId: string) => {
  // remove dashes from layerId UUID
  const _layerId = `user_data.${layerId.replace(/-/g, "")}`;
  const { data, isLoading, error } = useSWR<LayerQueryables>(
    [`${COLLECTIONS_API_BASE_URL}/${_layerId}/queryables`],
    fetcher,
  );
  return { queryables: data, isLoading, isError: error };
};

export const useLayerClassBreaks = (
  layerId: string,
  operation?: ClassBreaks,
  column?: string,
  breaks?: number,
) => {
  const { data, isLoading, error } = useSWR<LayerClassBreaks>(
    () =>
      operation && column && breaks
        ? [
            `${LAYERS_API_BASE_URL}/${layerId}/class-breaks/${operation}/${column}/?breaks=${breaks}`,
          ]
        : null,
    fetcher,
  );
  return { classBreaks: data, isLoading, isError: error };
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

export const getLayerClassBreaks = async (
  layerId: string,
  operation: ClassBreaks,
  column: string,
  breaks: number,
): Promise<LayerClassBreaks> => {
  const response = await fetchWithAuth(
    `${LAYERS_API_BASE_URL}/${layerId}/class-breaks/${operation}/${column}/?breaks=${breaks}`,
    {
      method: "GET",
    },
  );
  if (!response.ok) {
    throw new Error("Failed to get class breaks");
  }
  return await response.json();
};
