import { fetchWithAuth } from "@/lib/api/fetcher";
import type {
  PostAggregatePolygon,
  PostBuffer,
  PostOriginDestination,
  PostOevGueteKlassen,
  PostTripCount,
  PostJoin,
  PostAggregatePoint,
} from "@/lib/validations/tools";

const PROJECTS_API_BASE_URL = new URL(
  "api/v2/tool",
  process.env.NEXT_PUBLIC_API_URL,
).href;

const API_BASE_URL = new URL("api/v2", process.env.NEXT_PUBLIC_API_URL).href;

export const computeOevGueteKlassen = async (
  body: PostOevGueteKlassen,
  projectId: string,
) => {
  const response = await fetchWithAuth(
    `${API_BASE_URL}/motorized-mobility/oev-gueteklassen?project_id=${projectId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );
  if (!response.ok) {
    throw new Error("Failed to compute active mobility catchment area");
  }
  return await response.json();
};

export const computeTripCount = async (
  body: PostTripCount,
  projectId: string,
) => {
  const response = await fetchWithAuth(
    `${API_BASE_URL}/motorized-mobility/trip-count-station?project_id=${projectId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );
  if (!response.ok) {
    throw new Error("Failed to compute trip count station");
  }
  return await response.json();
};

export const computeJoin = async (body: PostJoin, projectId: string) => {
  const response = await fetchWithAuth(
    `${PROJECTS_API_BASE_URL}/join?project_id=${projectId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );
  if (!response.ok) {
    throw new Error("Failed to compute join");
  }
  return await response.json();
};

export const computeBuffer = async (body: PostBuffer, projectId: string) => {
  const response = await fetchWithAuth(
    `${PROJECTS_API_BASE_URL}/buffer?project_id=${projectId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );
  if (!response.ok) {
    throw new Error("Failed to compute buffer");
  }
  return await response.json();
};

export const computeAggregatePoint = async (
  body: PostAggregatePoint,
  projectId: string,
) => {
  const response = await fetchWithAuth(
    `${PROJECTS_API_BASE_URL}/aggregate-points?project_id=${projectId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );
  if (!response.ok) {
    throw new Error("Failed to compute aggregate");
  }
  return await response.json();
};

export const computeAggregatePolygon = async (
  body: PostAggregatePolygon,
  projectId: string,
) => {
  const response = await fetchWithAuth(
    `${PROJECTS_API_BASE_URL}/aggregate-polygons?project_id=${projectId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );
  if (!response.ok) {
    throw new Error("Failed to compute aggregate");
  }
  return await response.json();
};

//**  */

export const sendODRequest = async (
  body: PostOriginDestination,
  projectId: string,
) => {
  return await fetchWithAuth(
    `${PROJECTS_API_BASE_URL}/origin-destination?project_id=${projectId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );
};
