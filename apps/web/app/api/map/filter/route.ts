import { NextResponse } from "next/server";
import { getProjectLayers } from "@/lib/api/projects";
import { parseCQLQueryToObject } from "@/lib/utils/filtering/cql_to_expression";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const layerId = url.searchParams.get("layerId");
  const projectId = url.searchParams.get("projectId");
  const data = await getProjectLayers(projectId);
  const queries = data.filter((layer) => layer.id === layerId)[0].query;
  // const expressions = Object.keys(queries).map((query) =>
  //   parseCQLQueryToObject(queries[query], query),
  // );
  // return NextResponse.json(expressions);
  return NextResponse.json(queries);
}
