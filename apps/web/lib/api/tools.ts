import type { PostJoin, PostAggregate } from "@/lib/validations/tools";

const PROJECTS_API_BASE_URL = new URL(
  "api/v2/tool",
  process.env.NEXT_PUBLIC_API_URL,
).href;

export const SendJoinFeatureRequest = async (body: PostJoin) => {
  await fetch(
    `${PROJECTS_API_BASE_URL}/join`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );
}

export const SendAggregateFeatureRequest = async (body: PostAggregate) => {
  await fetch(
    `${PROJECTS_API_BASE_URL}/aggregate-points`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );
}