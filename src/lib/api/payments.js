import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getBackendAuthHeaders } from "@/lib/server-auth-token";

async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user || null;
}

async function getSecureFetchHeaders() {
  const user = await getCurrentUser();

  if (!user) {
    return {};
  }

  return getBackendAuthHeaders(user);
}

function formatDate(dateValue) {
  if (!dateValue) {
    return "N/A";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return date.toISOString().slice(0, 10);
}

function formatMoney(amountTotal, currency) {
  const amount = Number(amountTotal || 0) / 100;
  const currencyText = String(currency || "usd").toUpperCase();

  return `${currencyText} ${amount.toFixed(2)}`;
}

function makePayment(payment) {
  return {
    _id: payment._id?.toString(),
    userId: payment.userId || "",
    userName: payment.userName || "N/A",
    userEmail: payment.userEmail || "N/A",
    role: payment.role || "N/A",
    planId: payment.planId || "N/A",
    planName: payment.planName || "N/A",
    stripeSessionId: payment.stripeSessionId || "N/A",
    stripeCustomerId: payment.stripeCustomerId || "N/A",
    stripeSubscriptionId: payment.stripeSubscriptionId || "N/A",
    amountText: formatMoney(payment.amountTotal, payment.currency),
    paymentStatus: payment.paymentStatus || "N/A",
    planStartedAtText: formatDate(payment.planStartedAt),
    planExpiresAtText: formatDate(payment.planExpiresAt),
    createdAtText: formatDate(payment.createdAt),
  };
}

function getServerUrl() {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  if (!serverUrl) {
    throw new Error("NEXT_PUBLIC_SERVER_URL is missing from your environment variables.");
  }

  return serverUrl;
}

export async function getAllPayments() {
  const response = await fetch(`${getServerUrl()}/plans/payments`, {
    cache: "no-store",
    headers: await getSecureFetchHeaders(),
  });

  if (!response.ok) {
    return [];
  }

  const payments = await response.json();

  return payments.map(makePayment);
}

export async function getUserPayments(userId, userEmail = "") {
  if (!userId) {
    return [];
  }

  const searchParams = new URLSearchParams();

  if (userEmail) {
    searchParams.set("email", userEmail);
  }

  const queryString = searchParams.toString();
  const apiUrl = `${getServerUrl()}/plans/user/${userId}${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(apiUrl, {
    cache: "no-store",
    headers: await getSecureFetchHeaders(),
  });

  if (!response.ok) {
    return [];
  }

  const payments = await response.json();

  return payments.map(makePayment);
}
