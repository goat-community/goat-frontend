import useSWR from "swr";
import { fetcher } from "@/lib/api/fetcher";

export const useSubscription = () => {
  const { data, isLoading, error, mutate, isValidating } =
    useSWR(
      "/api/dashboard/subscription",
      fetcher,
    );

  return {
    Subscriptions: data,
    isLoading: isLoading,
    isError: error,
    mutate,
    isValidating,
  };
};
