import { NextResponse } from "next/server";
import { tempCardInfo } from "@/public/assets/data/homeProjects";

export async function GET() {
  return NextResponse.json(tempCardInfo);
}
