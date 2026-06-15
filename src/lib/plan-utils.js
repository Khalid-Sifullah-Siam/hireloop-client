export const seekerPlanLimits = {
  seeker_free: 3,
  seeker_pro: 30,
  seeker_premium: Number.POSITIVE_INFINITY,
};

export const recruiterPlanLimits = {
  recruiter_free: 3,
  recruiter_growth: 10,
  recruiter_enterprise: 50,
};

export const planNames = {
  seeker_free: "Free",
  seeker_pro: "Pro",
  seeker_premium: "Premium",
  recruiter_free: "Free",
  recruiter_growth: "Growth",
  recruiter_enterprise: "Enterprise",
};

export function getDefaultPlanForRole(role) {
  return role === "recruiter" ? "recruiter_free" : "seeker_free";
}

export function getSeekerApplicationLimit(planId) {
  return seekerPlanLimits[planId] ?? seekerPlanLimits.seeker_free;
}

export function getRecruiterJobLimit(planId) {
  return recruiterPlanLimits[planId] ?? recruiterPlanLimits.recruiter_free;
}

export function getPlanName(planId) {
  return planNames[planId] || "Free";
}

export function isUnlimitedPlan(planId) {
  return planId === "seeker_premium";
}

export function formatPlanLimit(limit) {
  return Number.isFinite(limit) ? String(limit) : "Unlimited";
}
