import useSWR from "swr";
import { fetcher } from "@/lib/api/fetcher";
import type { AppSubscription } from "@/lib/validations/subscription";

export const SUBSCRIPTION_API_BASE_URL = new URL(
  "api/v1/subscriptions",
  process.env.NEXT_PUBLIC_ACCOUNTS_API_URL,
).href;

export const useAppSubscription = () => {
  const { data, isLoading, error, mutate, isValidating } =
    useSWR<AppSubscription>(`${SUBSCRIPTION_API_BASE_URL}`, fetcher);
  return {
    subscription: data,
    isLoading: isLoading,
    isError: error,
    mutate,
    isValidating,
  };
};
