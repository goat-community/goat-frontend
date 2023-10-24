import { getProjectLayers } from "@/lib/api/projects";
import { parseCQLQueryToObject } from "@/lib/utils/filtering/cql_to_expression";
import { v4 } from "uuid";

export const useFilterExpressions = () => {
  const PROJECTS_API_BASE_URL = new URL(
    "api/v2/project",
    process.env.NEXT_PUBLIC_API_URL,
  ).href;

  const getLayerFilterParsedExpressions = (queries) => {
    const expressions = Object.keys(queries).map((query) =>
      parseCQLQueryToObject(queries[query], query),
    );

    return expressions;
    // try {
    //   const queries = await getLayerQueries(projectId, id);
    //   return Object.keys(queries).map((expression) =>
    //     parseCQLQueryToObject(queries[expression], expression),
    //   );
    // } catch (error) {
    //   console.error(error);
    //   throw Error(
    //     `error: make sure you are connected to an internet connection!`,
    //   );
    // }
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
    updateProjectLayerQuery,
    deleteAnExpression,
    createExpression,
    duplicateAnExpression,
  };
};
