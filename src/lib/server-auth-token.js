import { createHmac } from "crypto";

function toText(value) {
  return String(value || "").trim();
}

function base64UrlEncode(value) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function getJwtSecret() {
  const secret = process.env.JWT_SECRET || process.env.BETTER_AUTH_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is missing from your environment variables.");
  }

  return secret;
}

function getUserRole(user) {
  const role = toText(user?.role);

  if (role) {
    return role;
  }

  const plan = toText(user?.plan);

  if (plan.startsWith("recruiter_")) {
    return "recruiter";
  }

  return "seeker";
}

export function createServerJwt(user) {
  const userId = toText(user?.id || user?._id || user?.userId);

  if (!userId) {
    throw new Error("User id is required to create a secure API token.");
  }

  const now = Math.floor(Date.now() / 1000);
  const header = {
    alg: "HS256",
    typ: "JWT",
  };
  const payload = {
    sub: userId,
    userId,
    email: toText(user?.email),
    name: toText(user?.name),
    role: getUserRole(user),
    iat: now,
    exp: now + 5 * 60,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const unsignedToken = `${encodedHeader}.${encodedPayload}`;
  const signature = createHmac("sha256", getJwtSecret())
    .update(unsignedToken)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

  return `${unsignedToken}.${signature}`;
}

export function getBackendAuthHeaders(user) {
  return {
    Authorization: `Bearer ${createServerJwt(user)}`,
  };
}

export function getBackendJsonHeaders(user) {
  return {
    "Content-Type": "application/json",
    ...getBackendAuthHeaders(user),
  };
}
