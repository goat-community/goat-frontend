import { fetchWithAuth } from "@/lib/api/fetcher";
import type {
  Organization,
  PostOrganization,
} from "@/lib/validations/organization";

export const ORG_API_BASE_URL = new URL(
  "api/v1/organizations",
  process.env.NEXT_PUBLIC_ACCOUNTS_API_URL,
).href;

export const createOrganization = async (
  payload: PostOrganization,
): Promise<Organization> => {
  const response = await fetchWithAuth(`${ORG_API_BASE_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error("Failed to create folder");
  }
  return await response.json();
};
