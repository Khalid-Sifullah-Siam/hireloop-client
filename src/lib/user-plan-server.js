import { getBackendJsonHeaders } from "@/lib/server-auth-token";

const getUsersApiUrl = () => {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  if (!serverUrl) {
    throw new Error("NEXT_PUBLIC_SERVER_URL is missing from your environment variables.");
  }

  return `${serverUrl}/users`;
};

export function getPlanExpireDate() {
  const expireDate = new Date();
  expireDate.setDate(expireDate.getDate() + 30);

  return expireDate;
}

export async function getFreshUserPlan(user, fallbackPlan = "seeker_free") {
  const planStatus = await getFreshUserPlanStatus(user, fallbackPlan);

  return planStatus.plan;
}

export async function getFreshUserAccountStatus(user, fallbackPlan = "seeker_free") {
  const planStatus = await getFreshUserPlanStatus(user, fallbackPlan);
  const status = String(planStatus.status || "pending").toLowerCase();
  const suspended = Boolean(planStatus.suspended);

  return {
    status,
    suspended,
    isActive: status === "active" && !suspended,
  };
}

export async function getFreshUserPlanStatus(user, fallbackPlan = "seeker_free") {
  if (!user) {
    return {
      plan: fallbackPlan,
      planExpiresAt: null,
      isExpired: false,
    };
  }

  if (!user.id && !user.email) {
    return {
      plan: user.plan || fallbackPlan,
      planExpiresAt: user.planExpiresAt || null,
      isExpired: false,
    };
  }

  const response = await fetch(`${getUsersApiUrl()}/plan-status`, {
    method: "POST",
    headers: getBackendJsonHeaders(user),
    cache: "no-store",
    body: JSON.stringify({
      user,
      fallbackPlan,
    }),
  });

  if (!response.ok) {
    return {
      plan: user.plan || fallbackPlan,
      planExpiresAt: user.planExpiresAt || null,
      isExpired: false,
    };
  }

  return response.json();
}
