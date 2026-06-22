'use server';

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { getBackendAuthHeaders, getBackendJsonHeaders } from "@/lib/server-auth-token";

function getJobsApiBase() {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  if (!serverUrl) {
    throw new Error("NEXT_PUBLIC_SERVER_URL is missing from your environment variables.");
  }

  return `${serverUrl}/jobs`;
}

async function getCurrentRecruiter() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user || session.user.role !== "recruiter") {
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

export async function deleteRecruiterJob(jobId) {
  const recruiter = await getCurrentRecruiter();

  if (!recruiter) {
    throw new Error("Only recruiters can delete jobs.");
  }

  const response = await fetch(`${getJobsApiBase()}/${jobId}`, {
    method: "DELETE",
    headers: getBackendAuthHeaders(recruiter),
  });

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(data?.message || "Failed to delete job.");
  }

  revalidatePath("/dashboard/recruiter/jobs");
  return data;
}

export async function updateRecruiterJob(jobId, payload) {
  const recruiter = await getCurrentRecruiter();

  if (!recruiter) {
    throw new Error("Only recruiters can update jobs.");
  }

  const response = await fetch(`${getJobsApiBase()}/${jobId}`, {
    method: "PATCH",
    headers: getBackendJsonHeaders(recruiter),
    body: JSON.stringify(payload),
  });

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(data?.message || "Failed to update job.");
  }
  // Revalidate the jobs list and the specific job pages so updated info appears
  revalidatePath("/dashboard/recruiter/jobs");
  try {
    revalidatePath(`/dashboard/recruiter/jobs/${jobId}`);
  } catch (e) {
    // ignore if route doesn't exist or can't be revalidated
  }

  try {
    revalidatePath(`/job/${jobId}`);
  } catch (e) {
    // ignore if route doesn't exist or can't be revalidated
  }
  return data;
}

export async function updateApplicationStatus(applicationId, status) {
  const recruiter = await getCurrentRecruiter();

  if (!recruiter) {
    throw new Error("Only recruiters can update applications.");
  }

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  if (!serverUrl) {
    throw new Error("NEXT_PUBLIC_SERVER_URL is missing from your environment variables.");
  }

  const response = await fetch(`${serverUrl}/applications/${applicationId}/status`, {
    method: "PATCH",
    headers: getBackendJsonHeaders(recruiter),
    body: JSON.stringify({ status }),
  });

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(data?.message || "Failed to update application status.");
  }

  revalidatePath("/dashboard/recruiter/jobs");
  return data;
}
