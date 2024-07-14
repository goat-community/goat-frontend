import useSWR from "swr";

import { fetchWithAuth, fetcher } from "@/lib/api/fetcher";
import type { PaginatedQueryParams } from "@/lib/validations/common";
import type {
  ClassBreaks,
  CreateFeatureLayer,
  DatasetCollectionItems,
  DatasetDownloadRequest,
  DatasetMetadataAggregated,
  GetCollectionItemsQueryParams,
  GetDatasetSchema,
  GetLayerUniqueValuesQueryParams,
  Layer,
  LayerClassBreaks,
  LayerPaginated,
  LayerQueryables,
  LayerUniqueValuesPaginated,
  PostDataset,
} from "@/lib/validations/layer";

export const LAYERS_API_BASE_URL = new URL("api/v2/layer", process.env.NEXT_PUBLIC_API_URL).href;

export const COLLECTIONS_API_BASE_URL = new URL("collections", process.env.NEXT_PUBLIC_GEOAPI_URL).href;

export const useLayers = (queryParams?: PaginatedQueryParams, payload: GetDatasetSchema = {}) => {
  const { data, isLoading, error, mutate, isValidating } = useSWR<LayerPaginated>(
    [`${LAYERS_API_BASE_URL}`, queryParams, payload],
    fetcher
  );
  return {
    layers: data,
    isLoading: isLoading,
    isError: error,
    mutate,
    isValidating,
  };
};

export const useCatalogLayers = (queryParams?: PaginatedQueryParams, payload: GetDatasetSchema = {}) => {
  const { data, isLoading, error, mutate, isValidating } = useSWR<LayerPaginated>(
    [`${LAYERS_API_BASE_URL}/catalog`, queryParams, payload],
    fetcher
  );
  return {
    layers: data,
    isLoading: isLoading,
    isError: error,
    mutate,
    isValidating,
  };
};

export const useMetadataAggregated = (payload: GetDatasetSchema = {}) => {
  const { data, isLoading, error, mutate } = useSWR<DatasetMetadataAggregated>(
    [`${LAYERS_API_BASE_URL}/metadata/aggregate`, null, payload],
    fetcher
  );
  return { metadata: data, isLoading, isError: error, mutate };
};

export const useDataset = (datasetId: string) => {
  const { data, isLoading, error, mutate } = useSWR<Layer>(
    () => (datasetId ? [`${LAYERS_API_BASE_URL}/${datasetId}`] : null),
    fetcher
  );
  return { dataset: data, isLoading, isError: error, mutate };
};

export const updateDataset = async (datasetId: string, payload: PostDataset) => {
  const response = await fetchWithAuth(`${LAYERS_API_BASE_URL}/${datasetId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    await response.json();
  }
  return response;
};

export const useDatasetCollectionItems = (datasetId: string, queryParams?: GetCollectionItemsQueryParams) => {
  const collectionId = `user_data.${datasetId.replace(/-/g, "")}`;
  const { data, isLoading, error, mutate } = useSWR<DatasetCollectionItems>(
    () => (datasetId ? [`${COLLECTIONS_API_BASE_URL}/${collectionId}/items`, queryParams] : null),
    fetcher
  );
  return { data, isLoading, isError: error, mutate };
};

export const useLayerQueryables = (layerId: string) => {
  // remove dashes from layerId UUID
  const _layerId = `user_data.${layerId.replace(/-/g, "")}`;
  const { data, isLoading, error } = useSWR<LayerQueryables>(
    () => (layerId ? [`${COLLECTIONS_API_BASE_URL}/${_layerId}/queryables`] : null),
    fetcher
  );
  return { queryables: data, isLoading, isError: error };
};

//TODO: remove this hook and use useLayerQueryables instead
export const useLayerKeys = (layerId: string) => {
  const { data, isLoading, error } = useSWR<LayerPaginated>(
    [`${COLLECTIONS_API_BASE_URL}/${layerId}/queryables`],
    fetcher
  );
  return { data, isLoading, error };
};

export const useLayerClassBreaks = (
  layerId: string,
  operation?: ClassBreaks,
  column?: string,
  breaks?: number
) => {
  const { data, isLoading, error } = useSWR<LayerClassBreaks>(
    () =>
      operation && column && breaks
        ? [`${LAYERS_API_BASE_URL}/${layerId}/class-breaks/${operation}/${column}?breaks=${breaks}`]
        : null,
    fetcher
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

export const createInternalLayer = async (payload: CreateFeatureLayer, projectId?: string) => {
  const url = new URL(`${LAYERS_API_BASE_URL}/internal`);
  if (projectId) {
    url.searchParams.append("project_id", projectId);
  }
  const response = await fetchWithAuth(url.toString(), {
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
  breaks: number
): Promise<LayerClassBreaks> => {
  const response = await fetchWithAuth(
    `${LAYERS_API_BASE_URL}/${layerId}/class-breaks/${operation}/${column}?breaks=${breaks}`,
    {
      method: "GET",
    }
  );
  if (!response.ok) {
    throw new Error("Failed to get class breaks");
  }
  return await response.json();
};

export const getLayerUniqueValues = async (
  layerId: string,
  column: string,
  size?: number
): Promise<LayerUniqueValuesPaginated> => {
  const response = await fetchWithAuth(
    `${LAYERS_API_BASE_URL}/${layerId}/unique-values/${column}${size ? `?size=${size}` : ""}`,
    {
      method: "GET",
    }
  );
  if (!response.ok) {
    throw new Error("Failed to get unique values");
  }
  return await response.json();
};

export const useUniqueValues = (layerId: string, column: string, page?: number) => {
  const { data, isLoading, error } = useSWR<LayerUniqueValuesPaginated>(
    [`${LAYERS_API_BASE_URL}/${layerId}/unique-values/${column}${page ? `?page=${page}` : ""}`],
    fetcher
  );
  return { data, isLoading, error };
};

export const useLayerUniqueValues = (
  layerId: string,
  column: string,
  queryParams?: GetLayerUniqueValuesQueryParams
) => {
  const { data, isLoading, error, mutate, isValidating } = useSWR<LayerUniqueValuesPaginated>(
    [`${LAYERS_API_BASE_URL}/${layerId}/unique-values/${column}`, queryParams],
    fetcher
  );
  return { data, isLoading, error, mutate, isValidating };
};

export const downloadDataset = async (payload: DatasetDownloadRequest) => {
  const response = await fetchWithAuth(`${LAYERS_API_BASE_URL}/internal/${payload.id}/export`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to download layer");
  }
  return await response.blob();
};
export const useClassBreak = (layerId: string, operation: string, column: string, breaks: number) => {
  const { data, isLoading, error } = useSWR<Record<string, number>>(
    [`${LAYERS_API_BASE_URL}/${layerId}/class-breaks/${operation}/${column}?breaks=${breaks}`],
    fetcher
  );
  return { data, isLoading, error };
};
