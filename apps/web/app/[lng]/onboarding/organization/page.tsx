import { redirect } from "next/navigation";

export default async function Home() {
  return redirect(`/onboarding/organization/create`);
}
