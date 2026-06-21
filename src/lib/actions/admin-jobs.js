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

async function readResponse(response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

function getJobStatus(job) {
  const status = String(job.status || "").trim().toLowerCase();
  const deadlineValue = job.deadline || job.applicationDeadline;

  if (deadlineValue) {
    const deadlineDate = new Date(deadlineValue);

    if (!Number.isNaN(deadlineDate.getTime()) && deadlineDate.getTime() < Date.now()) {
      return "expired";
    }
  }

  if (status === "approved" || status === "pending" || status === "rejected" || status === "expired") {
    return status;
  }

  return status || "pending";
}

export async function getAdminJobs(status = "all") {
  const admin = await getCurrentAdmin();

  if (!admin) {
    return [];
  }

  const response = await fetch(`${getAdminApiBase()}/jobs`, {
    cache: "no-store",
    headers: getBackendAuthHeaders(admin),
  });

  if (!response.ok) {
    return [];
  }

  const jobs = await response.json();
  const normalizedJobs = jobs.map((job) => ({
    ...job,
    status: getJobStatus(job),
  }));

  if (status && status !== "all") {
    return normalizedJobs.filter((job) => job.status === status);
  }

  return normalizedJobs;
}

export async function getAdminJobStats() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    return {
      pendingCount: 0,
      approvedCount: 0,
      rejectedCount: 0,
      expiredCount: 0,
    };
  }

  const response = await fetch(`${getAdminApiBase()}/jobs/stats`, {
    cache: "no-store",
    headers: getBackendAuthHeaders(admin),
  });

  if (!response.ok) {
    return {
      pendingCount: 0,
      approvedCount: 0,
      rejectedCount: 0,
      expiredCount: 0,
    };
  }

  return response.json();
}

export async function updateAdminJobStatus(formData) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    throw new Error("Only admins can update job status.");
  }

  const jobId = String(formData.get("jobId") || "").trim();
  const status = String(formData.get("status") || "").trim().toLowerCase();

  if (!jobId || !status) {
    throw new Error("Job id and status are required.");
  }

  const response = await fetch(`${getAdminApiBase()}/jobs/${jobId}/status`, {
    method: "PATCH",
    headers: getBackendJsonHeaders(admin),
    body: JSON.stringify({ status }),
  });

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(data?.message || "Failed to update job status.");
  }

  revalidatePath("/dashboard/admin/jobs");
  return data;
}
