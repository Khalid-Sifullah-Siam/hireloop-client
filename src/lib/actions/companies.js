'use server';

import { headers } from "next/headers";
import { auth } from "@/lib/auth";

function getCompaniesApiUrl() {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  if (!serverUrl) {
    throw new Error("NEXT_PUBLIC_SERVER_URL is missing from your environment variables.");
  }

  return `${serverUrl}/companies`;
}

async function readResponse(response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

async function getCurrentRecruiter() {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session?.user || session.user.role !== "recruiter") {
    return null;
  }

  return session.user;
}

export async function createCompany(companyData) {
  const recruiter = await getCurrentRecruiter();

  if (!recruiter) {
    throw new Error("Only recruiters can create companies.");
  }

  const response = await fetch(`${getCompaniesApiUrl()}/recruiter/${recruiter.id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(companyData),
  });

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(data?.message || "Failed to save company.");
  }

  return data;
}

export async function updateCompany(companyData) {
  const recruiter = await getCurrentRecruiter();

  if (!recruiter) {
    throw new Error("Only recruiters can update companies.");
  }

  const response = await fetch(
    `${getCompaniesApiUrl()}/recruiter/${recruiter.id}/${companyData.id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(companyData),
    }
  );

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(data?.message || "Failed to update company.");
  }

  return data;
}

export async function getCompanies() {
  const recruiter = await getCurrentRecruiter();

  if (!recruiter) {
    return [];
  }

  const response = await fetch(`${getCompaniesApiUrl()}/recruiter/${recruiter.id}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return [];
  }

  return response.json();
}
