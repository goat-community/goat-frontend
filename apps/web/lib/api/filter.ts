import useSWR from "swr";
import { fetcher } from "./fetcher";

export const PROJECTS_API_BASE_URL = new URL(
  "api/v2/project",
  process.env.NEXT_PUBLIC_API_URL,
).href;

export const useGetLayerKeys = (layerId) => {
  const { data, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_GEOAPI_URL}/collections/${`user_data.${layerId.replace(/-/g, "")}`}/queryables`,
    fetcher,
    );

  return {data, isLoading}
};

export const useFilterQueryExpressions = (
  projectId: string,
) => {
  const { data, mutate, isLoading, error } = useSWR(
    `${PROJECTS_API_BASE_URL}/${projectId}/layer`,
    fetcher,
  );
  return {data, mutate, isLoading, error}
};