import type { PostIsochrone, PostPTIsochrone } from "@/lib/validations/isochrone";
import { fetchWithAuth } from "@/lib/api/fetcher";

const ACCESSIBILITY_ISOCHRONE_API_BASE_URL = new URL(
  "api/v2/active-mobility/isochrone",
  process.env.NEXT_PUBLIC_API_URL,
).href;

const PT_ISOCHRONE_API_BASE_URL = new URL(
  "api/v2/motorized-mobility/pt/isochrone",
  process.env.NEXT_PUBLIC_API_URL,
).href;

const CAR_ISOCHRONE_API_BASE_URL = new URL(
  "api/v2/motorized-mobility/car/isochrone",
  process.env.NEXT_PUBLIC_API_URL,
).href;

export const SendIsochroneRequest = async (body: PostIsochrone) => {
  await fetchWithAuth(ACCESSIBILITY_ISOCHRONE_API_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .then((data) => console.log(data));
};

export const SendPTIsochroneRequest = async (body: PostPTIsochrone) => {
  await fetchWithAuth(PT_ISOCHRONE_API_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .then((data) => console.log(data));
};

export const SendCarIsochroneRequest = async (body: PostIsochrone) => {
  await fetchWithAuth(CAR_ISOCHRONE_API_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .then((data) => console.log(data));
};
