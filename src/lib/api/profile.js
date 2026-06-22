import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getBackendAuthHeaders } from "@/lib/server-auth-token";

export async function getMyProfile() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;

  if (!user) {
    return null;
  }

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  if (!serverUrl) {
    throw new Error("NEXT_PUBLIC_SERVER_URL is missing from your environment variables.");
  }

  const response = await fetch(`${serverUrl}/users/profile`, {
    cache: "no-store",
    headers: getBackendAuthHeaders(user),
  });

  if (!response.ok) {
    return user;
  }

  return response.json();
}
