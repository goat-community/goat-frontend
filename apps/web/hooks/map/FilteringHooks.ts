import { getProjectLayers } from "@/lib/api/projects";
import { parseCQLQueryToObject } from "@/lib/utils/filtering/cql_to_expression";
import { v4 } from "uuid";
import { useFilterQueryExpressions } from "@/lib/api/filter";
import { useDispatch } from "react-redux";
import { setMapLoading } from "../../lib/store/map/slice";

export const useFilterExpressions = (projectId?: string) => {
  const PROJECTS_API_BASE_URL = new URL(
    "api/v2/project",
    process.env.NEXT_PUBLIC_API_URL,
  ).href;
  const dispatch = useDispatch();
  const {
    data: filterData,
    mutate,
    isLoading,
    error,
  } = useFilterQueryExpressions(projectId ? projectId : "");

  const getLayerFilterParsedExpressions = (queries) => {
    const expressions = Object.keys(queries).map((query) =>
      parseCQLQueryToObject(queries[query], query),
    );

    return expressions;
  };

  const getLayerQueries = async (projectId, id) => {
    try {
      const data = await getProjectLayers(projectId);
      const temporaryLayer = data
        ? data.find((layer) => layer.id === id)
        : undefined;

      if (
        temporaryLayer &&
        temporaryLayer.query &&
        Object.keys(temporaryLayer.query).length
      ) {
        return temporaryLayer.query;
      } else {
        return {};
      }
    } catch (error) {
      console.error(error);
      throw Error(
        `error: make sure you are connected to an internet connection!`,
      );
    }
  };

  const getFilterQueries = (layerId: string) => {
    if (!isLoading && !error) {
      const queries = filterData.filter((layer) => layer.id === layerId)[0]
        .query;
      if (queries && Object.keys(queries).length) {
        return {
          data: Object.keys(queries)
            .map((queries) => filterData[queries])
            .reverse(),
          mutate,
        };
      }
    }
    return {data: [], mutate}
  };

  const getFilterQueryExpressions = (layerId: string) => {
    if (!isLoading && !error && filterData.length) {
      const queries = filterData.filter((layer) => layer.id === layerId)[0]
        .query;
      dispatch(setMapLoading(false));

      return { data: getLayerFilterParsedExpressions(queries), mutate };
    }
    return { data: [], mutate };
  };

  const updateProjectLayerQuery = async (layerId, projectId, filterQuery) => {
    try {
      await fetch(
        `${PROJECTS_API_BASE_URL}/${projectId}/layer?layer_id=${layerId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: filterQuery,
        },
      );
    } catch (error) {
      console.error(error);
      throw Error(`error: unable to update the project`);
    }
  };

  const deleteAnExpression = async (id, projectId, layerId) => {
    const queries = await getLayerQueries(projectId, layerId);
    delete queries[id];
    updateProjectLayerQuery(
      layerId,
      projectId,
      `{"query": ${JSON.stringify(queries)}}`,
    );
  };

  const createExpression = async (projectId, id) => {
    const data = await getProjectLayers(projectId);

    const temporaryLayer = data
      ? data.find((layer) => layer.id === id)
      : undefined;
    if (temporaryLayer) {
      temporaryLayer.query[v4()] = "{}";
      updateProjectLayerQuery(
        id,
        projectId,
        `{"query": ${JSON.stringify(temporaryLayer.query)}}`,
      );
    }
  };

  const duplicateAnExpression = async (id, projectId, layerId) => {
    const queries = await getLayerQueries(projectId, layerId);
    queries[v4()] = queries[id];
    updateProjectLayerQuery(
      layerId,
      projectId,
      `{"query": ${JSON.stringify(queries)}}`,
    );
  };

  return {
    getLayerFilterParsedExpressions,
    getLayerQueries,
    getFilterQueryExpressions,
    updateProjectLayerQuery,
    deleteAnExpression,
    createExpression,
    duplicateAnExpression,
    getFilterQueries,
  };
};
