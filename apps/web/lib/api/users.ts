import useSWR from "swr";
import { fetcher } from "@/lib/api/fetcher";
import type { Organization } from "@/lib/validations/organization";

export const USERS_API_BASE_URL = new URL(
  "api/v1/users",
  process.env.NEXT_PUBLIC_ACCOUNTS_API_URL,
).href;

export const useOrganization = () => {
  const { data, isLoading, error, mutate, isValidating } = useSWR<Organization>(
    `${USERS_API_BASE_URL}/organization`,
    fetcher,
  );
  return {
    organization: data,
    isLoading: isLoading,
    isError: error,
    mutate,
    isValidating,
  };
};
