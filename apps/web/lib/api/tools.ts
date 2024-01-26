import { fetchWithAuth } from "@/lib/api/fetcher";
import type { PostJoin, PostAggregate, PostAggregatePolygon, PostBuffer, PostOevGuetenKlassen, PostTripCountStation } from "@/lib/validations/tools";

const PROJECTS_API_BASE_URL = new URL(
  "api/v2/tool",
  process.env.NEXT_PUBLIC_API_URL,
).href;

const API_BASE_URL = new URL(
  "api/v2",
  process.env.NEXT_PUBLIC_API_URL,
).href;

export const sendJoinFeatureRequest = async (
  body: PostJoin,
  projectId: string,
) => {

  await fetchWithAuth(`${PROJECTS_API_BASE_URL}/join?project_id=${projectId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((err) => console.log(err));
};

export const sendAggregateFeatureRequest = async (
  body: PostAggregate,
  projectId: string,
) => {
  await fetchWithAuth(
    `${PROJECTS_API_BASE_URL}/aggregate-points?project_id=${projectId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  )
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((err) => console.log(err));
};

export const sendAggregatePolygonRequest = async (
  body: PostAggregatePolygon,
  projectId: string,
) => {
  await fetchWithAuth(
    `${PROJECTS_API_BASE_URL}/aggregate-polygons?project_id=${projectId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  )
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((err) => console.log(err));
};

export const sendBufferRequest = async (
  body: PostBuffer,
  projectId: string,
) => {
  await fetchWithAuth(
    `${PROJECTS_API_BASE_URL}/buffer?project_id=${projectId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  )
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((err) => console.log(err));
};

export const sendOevGuetenKlassenRequest = async (
  body: PostOevGuetenKlassen,
  projectId: string,
) => {
  await fetchWithAuth(
    `${API_BASE_URL}/motorized-mobility/oev-gueteklassen?project_id=${projectId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  )
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((err) => console.log(err));
};

export const sendPostTripCountStationRequest = async (
  body: PostTripCountStation,
  projectId: string,
) => {
  await fetchWithAuth(
    `${API_BASE_URL}/motorized-mobility/trip-count-station?project_id=${projectId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  )
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((err) => console.log(err));
};