// import useSWR from "swr";
// import { fetcher } from "./fetcher";

import type { PostJoin } from "@/lib/validations/join";

const PROJECTS_API_BASE_URL = new URL(
  "api/v2/tool/join",
  process.env.NEXT_PUBLIC_API_URL,
).href;

export const SendJoinFeatureRequest = async (body: PostJoin) => {
  await fetch(
    `${PROJECTS_API_BASE_URL}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );

}