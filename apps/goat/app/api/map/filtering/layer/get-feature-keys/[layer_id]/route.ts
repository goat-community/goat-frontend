import { NextResponse } from "next/server";
import { GET_FEATURE_PROPERTY_KEYS } from "@/lib/api/apiConstants";

export async function GET(request: Request) {
  const layer_id = request.url.slice(request.url.lastIndexOf("/") + 1);

  try {
    const res = await fetch(GET_FEATURE_PROPERTY_KEYS(layer_id));

    const keys = await res.json();

    return NextResponse.json(keys);
  } catch (error) {
    console.error("Error fetching data:", error);
    return new NextResponse("Error fetching data from the data source.", {
      status: 500, // You can adjust the status code as needed
    });
  }
}
