'use server';

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getBackendJsonHeaders } from "@/lib/server-auth-token";

async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user || null;
}

async function readResponse(response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

export async function updateProfile(formData) {
  const user = await getCurrentUser();

  if (!user || (user.role !== "seeker" && user.role !== "recruiter")) {
    redirect("/auth/signin");
  }

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  if (!serverUrl) {
    throw new Error("NEXT_PUBLIC_SERVER_URL is missing from your environment variables.");
  }

  const returnTo = String(formData.get("returnTo") || "/dashboard/seeker/settings");
  const payload = {
    name: String(formData.get("name") || ""),
    email: String(formData.get("email") || ""),
    photo: String(formData.get("photo") || ""),
    avatar: String(formData.get("avatar") || ""),
    headline: String(formData.get("headline") || ""),
    bio: String(formData.get("bio") || ""),
    skills: String(formData.get("skills") || ""),
  };

  const response = await fetch(`${serverUrl}/users/profile`, {
    method: "PATCH",
    headers: getBackendJsonHeaders(user),
    body: JSON.stringify(payload),
  });

  const data = await readResponse(response);

  if (!response.ok) {
    redirect(`${returnTo}?error=${encodeURIComponent(data?.message || "Profile update failed.")}`);
  }

  revalidatePath("/dashboard/seeker/settings");
  revalidatePath("/dashboard/recruiter/settings");
  redirect(`${returnTo}?success=Profile updated successfully`);
}
