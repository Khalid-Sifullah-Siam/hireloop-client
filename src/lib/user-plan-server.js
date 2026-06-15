import { db } from "@/lib/db";
import { ObjectId } from "mongodb";
import { getDefaultPlanForRole } from "@/lib/plan-utils";

const getUserFilters = (user) => {
  const userFilters = [];

  if (user?.id) {
    userFilters.push({ id: user.id });

    if (ObjectId.isValid(user.id)) {
      userFilters.push({ _id: new ObjectId(user.id) });
    }
  }

  if (user?.email) {
    userFilters.push({ email: user.email });
  }

  return userFilters;
};

const isPlanExpired = (planExpiresAt) => {
  if (!planExpiresAt) {
    return false;
  }

  return new Date(planExpiresAt).getTime() <= Date.now();
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

export async function getFreshUserPlanStatus(user, fallbackPlan = "seeker_free") {
  if (!user) {
    return {
      plan: fallbackPlan,
      planExpiresAt: null,
      isExpired: false,
    };
  }

  const userFilters = getUserFilters(user);

  if (userFilters.length === 0) {
    return {
      plan: user.plan || fallbackPlan,
      planExpiresAt: user.planExpiresAt || null,
      isExpired: false,
    };
  }

  const usersCollection = db.collection("user");
  const savedUser = await usersCollection.findOne({ $or: userFilters });
  const currentUser = savedUser || user;
  const freePlan = getDefaultPlanForRole(currentUser.role || user.role);

  if (isPlanExpired(currentUser.planExpiresAt)) {
    await usersCollection.updateOne(
      { $or: userFilters },
      {
        $set: {
          plan: freePlan,
          planExpiredAt: new Date(),
        },
        $unset: {
          planExpiresAt: "",
          planStartedAt: "",
        },
      }
    );

    return {
      plan: freePlan,
      planExpiresAt: null,
      isExpired: true,
    };
  }

  return {
    plan: currentUser.plan || fallbackPlan,
    planExpiresAt: currentUser.planExpiresAt || null,
    isExpired: false,
  };
}
