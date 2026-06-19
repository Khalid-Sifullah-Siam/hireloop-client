'use server';

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

function getAdminCompaniesApiUrl() {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  if (!serverUrl) {
    throw new Error("NEXT_PUBLIC_SERVER_URL is missing from your environment variables.");
  }

  return `${serverUrl}/admin/companies`;
}

async function getCurrentAdmin() {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session?.user || session.user.role !== "admin") {
    return null;
  }

  return session.user;
}

async function readResponse(response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

export async function getAdminCompanies(status = "all") {
  const admin = await getCurrentAdmin();

  if (!admin) {
    return [];
  }

  const query = status && status !== "all" ? `?status=${encodeURIComponent(status)}` : "";
  const response = await fetch(`${getAdminCompaniesApiUrl()}${query}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return [];
  }

  return response.json();
}

export async function updateAdminCompanyStatus(formData) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    throw new Error("Only admins can update company status.");
  }

  const companyId = String(formData.get("companyId") || "").trim();
  const status = String(formData.get("status") || "").trim().toLowerCase();

  if (!companyId || !status) {
    throw new Error("Company id and status are required.");
  }

  const response = await fetch(`${getAdminCompaniesApiUrl()}/${companyId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(data?.message || "Failed to update company status.");
  }

  revalidatePath("/dashboard/admin/companies");
  return data;
}
