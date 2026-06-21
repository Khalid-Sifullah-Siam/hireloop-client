'use server';

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { getBackendAuthHeaders, getBackendJsonHeaders } from "@/lib/server-auth-token";

function getAdminApiBase() {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  if (!serverUrl) {
    throw new Error("NEXT_PUBLIC_SERVER_URL is missing from your environment variables.");
  }

  return `${serverUrl}/admin`;
}

async function getCurrentAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user || session.user.role !== "admin") {
    return null;
  }

  return session.user;
}

export async function getAdminUsers(role = "all") {
  const admin = await getCurrentAdmin();

  if (!admin) {
    return [];
  }

  const query = role && role !== "all" ? `?role=${encodeURIComponent(role)}` : "";
  const response = await fetch(`${getAdminApiBase()}/users${query}`, {
    cache: "no-store",
    headers: getBackendAuthHeaders(admin),
  });

  if (!response.ok) {
    return [];
  }

  return response.json();
}

async function readResponse(response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

export async function updateAdminUser(formData) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    throw new Error("Only admins can update users.");
  }

  const userId = String(formData.get("userId") || "").trim();
  const action = String(formData.get("action") || "").trim();
  const value = String(formData.get("value") || "").trim();

  if (!userId || !action) {
    throw new Error("User id and action are required.");
  }

  const body = {};

  if (action === "role") {
    body.role = value;
  }

  if (action === "status") {
    body.status = value;
  }

  if (action === "suspend") {
    body.suspended = value === "true";
  }

  const response = await fetch(`${getAdminApiBase()}/users/${encodeURIComponent(userId)}`, {
    method: "PATCH",
    headers: getBackendJsonHeaders(admin),
    body: JSON.stringify(body),
  });

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(data?.message || "Failed to update user.");
  }

  revalidatePath("/dashboard/admin/users");
  return data;
}
