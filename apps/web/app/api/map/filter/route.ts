import { NextResponse } from "next/server";
import { getProjectLayers } from "@/lib/api/projects";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const layerId = url.searchParams.get("layerId");
  const projectId = url.searchParams.get("projectId");
  const data = await getProjectLayers(projectId);
  console.log(data)
  const queries = data.filter((layer) => layer.id === layerId)[0].query;
  return NextResponse.json(queries);
}
