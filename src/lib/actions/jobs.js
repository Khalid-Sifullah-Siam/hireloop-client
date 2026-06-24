'use server';

import { getRecruiterJobs } from "@/lib/api/jobs";
import {
  db,
  getCurrentActiveUserWithRole,
  getCurrentUserWithRole,
  makeDocumentSafe,
  toText,
} from "@/lib/database-helpers";
import { getRecruiterJobLimit, getPlanName } from "@/lib/plan-utils";
import { getFreshUserPlanStatus } from "@/lib/user-plan-server";

function toBoolean(value) {
  return value === true || value === "true" || value === "on";
}

function getJobPayload(jobFormData) {
  if (typeof FormData !== "undefined" && jobFormData instanceof FormData) {
    return Object.fromEntries(jobFormData.entries());
  }

  return jobFormData || {};
}

function validateJobPayload(payload) {
  const requiredFields = [
    "jobTitle",
    "category",
    "jobType",
    "currency",
    "deadline",
    "responsibilities",
    "requirements",
    "companyId",
  ];
  const missingField = requiredFields.find((field) => !toText(payload[field]));

  if (missingField) {
    return `${missingField} is required.`;
  }

  if (!toBoolean(payload.isRemote) && !toText(payload.location)) {
    return "Location is required for non-remote jobs.";
  }

  const minSalary = Number(payload.minSalary);
  const maxSalary = Number(payload.maxSalary);

  if (!Number.isFinite(minSalary) || !Number.isFinite(maxSalary)) {
    return "Salary range must include valid minimum and maximum values.";
  }

  if (minSalary < 0 || maxSalary < minSalary) {
    return "Salary range is invalid.";
  }

  const deadline = new Date(payload.deadline);

  if (Number.isNaN(deadline.getTime())) {
    return "Please provide a valid deadline.";
  }

  return "";
}

function buildJob(payload, company, recruiter, planId) {
  const now = new Date();
  const minSalary = Number(payload.minSalary);
  const maxSalary = Number(payload.maxSalary);
  const isRemote = toBoolean(payload.isRemote);

  return {
    jobTitle: toText(payload.jobTitle),
    title: toText(payload.jobTitle),
    category: toText(payload.category),
    jobType: toText(payload.jobType),
    minSalary,
    maxSalary,
    salary: {
      min: minSalary,
      max: maxSalary,
      currency: toText(payload.currency),
    },
    currency: toText(payload.currency),
    location: isRemote ? toText(payload.location) || "Remote" : toText(payload.location),
    isRemote,
    deadline: toText(payload.deadline),
    applicationDeadline: new Date(payload.deadline),
    responsibilities: toText(payload.responsibilities),
    requirements: toText(payload.requirements),
    benefits: toText(payload.benefits),
    companyId: company.id,
    companyName: company.name,
    companyLogo: company.logo || "",
    companyWebsite: company.websiteUrl || "",
    companyPlan: getPlanName(planId),
    company: {
      id: company.id,
      name: company.name,
      logo: company.logo || "",
      websiteUrl: company.websiteUrl || "",
      plan: getPlanName(planId),
      recruiterId: recruiter.id,
    },
    recruiterId: recruiter.id,
    status: "pending",
    visibility: "public",
    createdAt: now,
    updatedAt: now,
  };
}

export async function createJob(jobFormData) {
  const payload = getJobPayload(jobFormData);
  const recruiter = await getCurrentActiveUserWithRole("recruiter");

  if (!recruiter) {
    return {
      success: false,
      message: "Please sign in with an active recruiter account before posting a job.",
    };
  }

  const validationMessage = validateJobPayload(payload);

  if (validationMessage) {
    return {
      success: false,
      message: validationMessage,
    };
  }

  const company = await db.collection("companies").findOne({
    id: toText(payload.companyId),
    recruiterId: recruiter.id,
  });

  if (!company) {
    return {
      success: false,
      message: "Company was not found for this recruiter.",
    };
  }

  if (toText(company.status).toLowerCase() !== "approved") {
    return {
      success: false,
      message: "This company must be approved before posting jobs.",
    };
  }

  const planStatus = await getFreshUserPlanStatus(recruiter, "recruiter_free");
  const jobLimit = getRecruiterJobLimit(planStatus.plan);
  const activeJobCount = await db.collection("jobs").countDocuments({
    recruiterId: recruiter.id,
    status: { $in: ["pending", "approved", "active"] },
  });

  if (activeJobCount >= jobLimit) {
    return {
      success: false,
      message: planStatus.isExpired
        ? "Your paid plan expired. Please upgrade again to post more jobs."
        : "Your current recruiter plan has reached its active job post limit.",
    };
  }

  const job = buildJob(payload, company, recruiter, planStatus.plan);
  const result = await db.collection("jobs").insertOne(job);

  return {
    success: true,
    message: "Job posted successfully and is waiting for admin approval.",
    jobId: result.insertedId.toString(),
    job: makeDocumentSafe({
      ...job,
      _id: result.insertedId,
    }),
  };
}

export async function getCurrentRecruiterJobs() {
  const recruiter = await getCurrentUserWithRole("recruiter");

  if (!recruiter) {
    return [];
  }

  return getRecruiterJobs(recruiter.id);
}

export async function getCurrentRecruiterPlanStatus() {
  const recruiter = await getCurrentUserWithRole("recruiter");

  if (!recruiter) {
    return {
      plan: "recruiter_free",
      planExpiresAt: null,
      isExpired: false,
    };
  }

  return getFreshUserPlanStatus(recruiter, "recruiter_free");
}
