import {
  db,
  findUserDocument,
  getUserFilters,
  makeDocumentSafe,
  toText,
} from "@/lib/database-helpers";
import { getDefaultPlanForRole } from "@/lib/plan-utils";

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
  const status = toText(planStatus.status || "pending").toLowerCase();
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
      status: "pending",
      suspended: false,
    };
  }

  const savedUser = await findUserDocument(user);
  const currentUser = savedUser || user;
  const role = currentUser.role || user.role;
  const freePlan = getDefaultPlanForRole(role);
  const expireTime = currentUser.planExpiresAt
    ? new Date(currentUser.planExpiresAt).getTime()
    : null;
  const isExpired =
    Number.isFinite(expireTime) &&
    expireTime <= Date.now();

  if (isExpired && savedUser) {
    const filters = getUserFilters(user);

    await db.collection("user").updateOne(
      { $or: filters },
      {
        $set: {
          plan: freePlan,
          planExpiredAt: new Date(),
          updatedAt: new Date(),
        },
        $unset: {
          planExpiresAt: "",
          planStartedAt: "",
        },
      }
    );
  }

  return {
    plan: isExpired
      ? freePlan
      : currentUser.plan || fallbackPlan,
    planExpiresAt: isExpired
      ? null
      : makeDocumentSafe(currentUser.planExpiresAt || null),
    isExpired,
    status: toText(currentUser.status) || "pending",
    suspended: Boolean(currentUser.suspended || currentUser.banned),
  };
}
