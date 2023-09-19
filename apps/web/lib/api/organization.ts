import useSWR from "swr";
import { fetcher } from "@/lib/api/fetcher";
import { OVERVIEW_API_URL } from "./apiConstants";


export const useOrganization = () => {
  const { data, isLoading, error, mutate, isValidating } =
    useSWR(OVERVIEW_API_URL, fetcher);
  return {
    Organization: data,
    isLoading: isLoading,
    isError: error,
    mutate,
    isValidating,
  };
};