import {
  db,
  getCurrentUser,
  makeDocumentSafe,
  toText,
} from "@/lib/database-helpers";

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

export async function getAllPayments() {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    return [];
  }

  const payments = await db.collection("plansCollection").find({}).sort({
    createdAt: -1,
    _id: -1,
  }).toArray();

  return payments.map((payment) => makePayment(makeDocumentSafe(payment)));
}

export async function getUserPayments(userId, userEmail = "") {
  const user = await getCurrentUser();

  if (!user || !userId) {
    return [];
  }

  const isAdmin = user.role === "admin";
  const isSameUser =
    toText(user.id) === toText(userId) ||
    toText(user.email).toLowerCase() === toText(userEmail).toLowerCase();

  if (!isAdmin && !isSameUser) {
    return [];
  }

  const filters = [{ userId: toText(userId) }];
  const email = toText(userEmail).toLowerCase();

  if (email) {
    filters.push({ userEmail: email });
  }

  if (filters.length === 0) {
    return [];
  }

  const payments = await db.collection("plansCollection").find({
    $or: filters,
  }).sort({
    createdAt: -1,
    _id: -1,
  }).toArray();

  return payments.map((payment) => makePayment(makeDocumentSafe(payment)));
}
