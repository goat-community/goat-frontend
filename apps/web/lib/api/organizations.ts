import { fetchWithAuth } from "@/lib/api/fetcher";
import type {
  InvitationCreate,
  Organization,
  OrganizationUpdate,
  PostOrganization,
} from "@/lib/validations/organization";
import type { User } from "@/lib/validations/user";

export const ORG_API_BASE_URL = new URL(
  "api/v1/organizations",
  process.env.NEXT_PUBLIC_ACCOUNTS_API_URL,
).href;

export const getOrganizationMembers = async (
  organization_id: string,
): Promise<User> => {
  const response = await fetchWithAuth(
    `${ORG_API_BASE_URL}/${organization_id}/members`,
    {
      method: "GET",
    },
  );
  if (!response.ok) throw await response.json();
  return await response.json();
};

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

export const updateOrganization = async (
  organization_id: string,
  organization: OrganizationUpdate,
) => {
  const response = await fetchWithAuth(
    `${ORG_API_BASE_URL}/${organization_id}/profile`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(organization),
    },
  );
  if (!response.ok) throw await response.json();
  return response;
};

export const deleteOrganization = async (organization_id: string) => {
  const response = await fetchWithAuth(
    `${ORG_API_BASE_URL}/${organization_id}`,
    {
      method: "DELETE",
    },
  );
  if (!response.ok) throw await response.json();
  return response;
};

export const deleteMember = async (
  organization_id: string,
  user_id: string,
) => {
  const response = await fetchWithAuth(
    `${ORG_API_BASE_URL}/${organization_id}/users/${user_id}`,
    {
      method: "DELETE",
    },
  );
  if (!response.ok) throw await response.json();
  return response;
};

export const updateMember = async (
  organization_id: string,
  user_id: string,
  role: string,
) => {
  const response = await fetchWithAuth(
    `${ORG_API_BASE_URL}/${organization_id}/users/${user_id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role }),
    },
  );
  if (!response.ok) throw await response.json();
  return response;
};

export const transferOwnership = async (
  organization_id: string,
  user_id: string,
) => {
  const response = await fetchWithAuth(
    `${ORG_API_BASE_URL}/${organization_id}/users/${user_id}/transfer-ownership`,
    {
      method: "PATCH",
    },
  );
  if (!response.ok) throw await response.json();
  return response;
};

export const inviteMember = async (
  organization_id: string,
  invitation: InvitationCreate,
) => {
  const response = await fetchWithAuth(
    `${ORG_API_BASE_URL}/${organization_id}/invitations`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(invitation),
    },
  );
  if (!response.ok) throw await response.json();
  return response;
};
