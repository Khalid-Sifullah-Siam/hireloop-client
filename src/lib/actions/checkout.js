'use server';

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getBackendJsonHeaders } from "@/lib/server-auth-token";

function getCheckoutApiUrl() {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  if (!serverUrl) {
    throw new Error("NEXT_PUBLIC_SERVER_URL is missing from your environment variables.");
  }

  return `${serverUrl}/checkout_sessions`;
}

async function readResponse(response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

export async function startCheckout(formData) {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });
  const user = session?.user;

  if (!user) {
    redirect("/auth/signin");
  }

  const planId = String(formData.get("planId") || "").trim();
  const origin =
    requestHeaders.get("origin") ||
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "";

  if (!planId) {
    redirect("/plans?error=Please choose a plan first");
  }

  const response = await fetch(getCheckoutApiUrl(), {
    method: "POST",
    headers: {
      ...getBackendJsonHeaders(user),
      Accept: "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({ planId, origin }),
  });

  const data = await readResponse(response);

  if (!response.ok || !data?.url) {
    const message = data?.error || data?.message || "Checkout could not start.";
    redirect(`/plans?error=${encodeURIComponent(message)}`);
  }

  redirect(data.url);
}
