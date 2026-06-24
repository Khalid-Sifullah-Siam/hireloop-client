import "server-only";
import { ObjectId } from "mongodb";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export function toText(value) {
  return String(value || "").trim();
}

export async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user || null;
}

export async function getCurrentUserWithRole(role) {
  const user = await getCurrentUser();

  if (!user || user.role !== role) {
    return null;
  }

  return user;
}

export function getIdFilters(id) {
  const cleanId = toText(id);
  const filters = [];

  if (!cleanId) {
    return filters;
  }

  filters.push({ id: cleanId });

  if (ObjectId.isValid(cleanId)) {
    filters.push({ _id: new ObjectId(cleanId) });
  }

  return filters;
}

export function getUserFilters(user) {
  const filters = getIdFilters(user?.id || user?._id || user?.userId);
  const email = toText(user?.email).toLowerCase();

  if (email) {
    filters.push({ email });
  }

  return filters;
}

export async function findUserDocument(user) {
  const filters = getUserFilters(user);

  if (filters.length === 0) {
    return null;
  }

  return db.collection("user").findOne({ $or: filters });
}

export async function getCurrentActiveUserWithRole(role) {
  const user = await getCurrentUserWithRole(role);

  if (!user) {
    return null;
  }

  const savedUser = await findUserDocument(user);
  const status = toText(savedUser?.status || user.status || "pending").toLowerCase();
  const suspended = Boolean(
    savedUser?.suspended ||
    savedUser?.banned ||
    user.suspended
  );

  if (!savedUser || status !== "active" || suspended) {
    return null;
  }

  return {
    ...user,
    ...makeDocumentSafe(savedUser),
    id: toText(savedUser.id || savedUser._id || user.id),
  };
}

export function makeDocumentSafe(value) {
  if (value instanceof Date) {
    return value.toISOString();
  }

  if (value instanceof ObjectId) {
    return value.toString();
  }

  if (Array.isArray(value)) {
    return value.map(makeDocumentSafe);
  }

  if (value && typeof value === "object") {
    const safeObject = {};

    for (const [key, item] of Object.entries(value)) {
      safeObject[key] = makeDocumentSafe(item);
    }

    return safeObject;
  }

  return value;
}

export { db };
