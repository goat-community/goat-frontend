import { NextResponse } from "next/server";
import { z } from "zod";

const url = "http://localhost:5005/api/v2/project";

const routeContextSchema = z.object({
  params: z.object({
    projectId: z.string(),
  }),
});

export async function GET(
  _: Request,
  context: z.infer<typeof routeContextSchema>,
) {
  const {
    params: { projectId },
  } = routeContextSchema.parse(context);
  try {
    const res = await fetch(`${url}/${projectId}`);

    const project = await res.json();

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error fetching data:", error);
    return new NextResponse("Error fetching data from the data source.", {
      status: 500, // You can adjust the status code as needed
    });
  }
}
