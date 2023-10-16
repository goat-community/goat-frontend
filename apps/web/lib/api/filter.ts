import useSWR from "swr";
import { GEO_API_ROOT } from "./apiConstants";
import { fetcher } from "./fetcher";
import { useFilterExpressions } from "@/hooks/map/FilteringHooks";

export const PROJECTS_API_BASE_URL = new URL(
  "api/v2/project",
  process.env.NEXT_PUBLIC_API_URL,
).href;

export const useGetLayerKeys = (layerId) => {
  const { data, isLoading, error } = useSWR(
    `${GEO_API_ROOT}/collections/${layerId}/queryables`,
    fetcher,
  );
  return {
    keys: isLoading
      ? []
      : Object.keys(data.properties)
          .filter((key) => "name" in data.properties[key])
          .map((key) => ({
            name: data.properties[key].name,
            type: data.properties[key].type,
          })),
  };
};

export const useFilterQueryExpressions = (
  projectId: string,
  layerId: string,
) => {
  const { getLayerFilterParsedExpressions } = useFilterExpressions();
  const { data, mutate, isLoading, error } = useSWR(
    `http://localhost:3000/api/map/filter?projectId=${projectId}&layerId=${layerId}`,
    fetcher );

  if(!isLoading && !error){
    return { data: getLayerFilterParsedExpressions(data), mutate };
  } 
  return { data, mutate };

};

export const useFilterQueries = (projectId: string, layerId: string) => {
  const { data, mutate, isLoading, error } = useSWR(
    `http://localhost:3000/api/map/filter?projectId=${projectId}&layerId=${layerId}`,
    fetcher,
    { onSuccess: (data) => Object.keys(data).map((queries)=>data[queries]).reverse() },
  );
  if (!isLoading && !error) {
    const queries = Object.keys(data).map((queries)=>data[queries]).reverse();
    return { data: queries, mutate };
  }

  return { data: [], mutate };
};
