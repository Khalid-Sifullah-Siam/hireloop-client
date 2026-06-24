'use server';

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import {
  db,
  getCurrentActiveUserWithRole,
  makeDocumentSafe,
  toText,
} from "@/lib/database-helpers";

function toBoolean(value) {
  return value === true || value === "true" || value === "on";
}

function getJobOwnerId(job) {
  return toText(job?.recruiterId || job?.company?.recruiterId);
}

function buildUpdatedJob(existingJob, payload, company, recruiterId) {
  const minSalary = Number(payload.minSalary ?? existingJob.minSalary ?? existingJob.salary?.min);
  const maxSalary = Number(payload.maxSalary ?? existingJob.maxSalary ?? existingJob.salary?.max);
  const currency = toText(payload.currency || existingJob.currency || existingJob.salary?.currency);
  const deadline = toText(payload.deadline || existingJob.deadline || existingJob.applicationDeadline);
  const isRemote = Object.prototype.hasOwnProperty.call(payload, "isRemote")
    ? toBoolean(payload.isRemote)
    : Boolean(existingJob.isRemote);

  if (!Number.isFinite(minSalary) || !Number.isFinite(maxSalary) || minSalary < 0 || maxSalary < minSalary) {
    throw new Error("Salary range is invalid.");
  }

  if (!deadline || Number.isNaN(new Date(deadline).getTime())) {
    throw new Error("Please provide a valid deadline.");
  }

  const location = isRemote
    ? toText(payload.location || existingJob.location) || "Remote"
    : toText(payload.location || existingJob.location);

  if (!location) {
    throw new Error("Location is required for non-remote jobs.");
  }

  return {
    jobTitle: toText(payload.jobTitle || existingJob.jobTitle || existingJob.title),
    title: toText(payload.jobTitle || existingJob.jobTitle || existingJob.title),
    category: toText(payload.category || existingJob.category),
    jobType: toText(payload.jobType || existingJob.jobType),
    minSalary,
    maxSalary,
    salary: {
      min: minSalary,
      max: maxSalary,
      currency,
    },
    currency,
    location,
    isRemote,
    deadline,
    applicationDeadline: new Date(deadline),
    responsibilities: toText(payload.responsibilities ?? existingJob.responsibilities),
    requirements: toText(payload.requirements ?? existingJob.requirements),
    benefits: toText(payload.benefits ?? existingJob.benefits),
    companyId: company.id,
    companyName: company.name,
    companyLogo: company.logo || "",
    companyWebsite: company.websiteUrl || "",
    companyPlan: toText(payload.companyPlan || existingJob.companyPlan || "Free"),
    company: {
      id: company.id,
      name: company.name,
      logo: company.logo || "",
      websiteUrl: company.websiteUrl || "",
      plan: toText(payload.companyPlan || existingJob.companyPlan || "Free"),
      recruiterId,
    },
    recruiterId,
    visibility: existingJob.visibility || "public",
    createdAt: existingJob.createdAt || new Date(),
    updatedAt: new Date(),
  };
}

export async function deleteRecruiterJob(jobId) {
  const recruiter = await getCurrentActiveUserWithRole("recruiter");

  if (!recruiter) {
    throw new Error("Only active recruiters can delete jobs.");
  }

  if (!ObjectId.isValid(toText(jobId))) {
    throw new Error("Invalid job id.");
  }

  const jobObjectId = new ObjectId(toText(jobId));
  const job = await db.collection("jobs").findOne({ _id: jobObjectId });

  if (!job) {
    throw new Error("Job was not found.");
  }

  if (getJobOwnerId(job) !== recruiter.id) {
    throw new Error("You can only delete your own jobs.");
  }

  await Promise.all([
    db.collection("jobs").deleteOne({ _id: jobObjectId }),
    db.collection("applications").deleteMany({
      $or: [{ jobId: toText(jobId) }, { "jobInfo.id": toText(jobId) }],
    }),
    db.collection("savedJobs").deleteMany({
      $or: [{ jobId: toText(jobId) }, { "jobInfo.id": toText(jobId) }],
    }),
  ]);

  revalidatePath("/dashboard/recruiter/jobs");
  revalidatePath("/jobs");

  return {
    message: "Job deleted successfully.",
  };
}

export async function updateRecruiterJob(jobId, payload) {
  const recruiter = await getCurrentActiveUserWithRole("recruiter");

  if (!recruiter) {
    throw new Error("Only active recruiters can update jobs.");
  }

  if (!ObjectId.isValid(toText(jobId))) {
    throw new Error("Invalid job id.");
  }

  const jobObjectId = new ObjectId(toText(jobId));
  const existingJob = await db.collection("jobs").findOne({ _id: jobObjectId });

  if (!existingJob) {
    throw new Error("Job was not found.");
  }

  if (getJobOwnerId(existingJob) !== recruiter.id) {
    throw new Error("You can only update your own jobs.");
  }

  const companyId = toText(
    payload.companyId ||
    existingJob.companyId ||
    existingJob.company?.id
  );
  const company = await db.collection("companies").findOne({
    id: companyId,
    recruiterId: recruiter.id,
  });

  if (!company) {
    throw new Error("Company was not found for this recruiter.");
  }

  const updatedFields = buildUpdatedJob(existingJob, payload, company, recruiter.id);
  const wasApproved = ["approved", "active"].includes(
    toText(existingJob.status).toLowerCase()
  );

  if (wasApproved) {
    await db.collection("jobs").updateOne(
      { _id: jobObjectId },
      {
        $set: {
          status: "pending",
          previousStatus: "approved",
          pendingUpdate: updatedFields,
          updatedAt: new Date(),
        },
      }
    );
  } else {
    await db.collection("jobs").updateOne(
      { _id: jobObjectId },
      {
        $set: {
          ...updatedFields,
          status: "pending",
        },
        $unset: {
          pendingUpdate: "",
          previousStatus: "",
        },
      }
    );
  }

  const savedJob = await db.collection("jobs").findOne({ _id: jobObjectId });

  revalidatePath("/dashboard/recruiter/jobs");
  revalidatePath(`/dashboard/recruiter/jobs/${jobId}`);
  revalidatePath(`/jobs/${jobId}`);
  revalidatePath(`/job/${jobId}`);
  revalidatePath("/jobs");

  return {
    message: "Job update sent for admin approval.",
    job: makeDocumentSafe(savedJob),
  };
}

export async function updateApplicationStatus(applicationId, status) {
  const recruiter = await getCurrentActiveUserWithRole("recruiter");

  if (!recruiter) {
    throw new Error("Only active recruiters can update applications.");
  }

  if (!ObjectId.isValid(toText(applicationId))) {
    throw new Error("Invalid application id.");
  }

  const nextStatus = toText(status).toLowerCase();
  const allowedStatuses = ["interview", "rejected", "hired"];

  if (!allowedStatuses.includes(nextStatus)) {
    throw new Error("Invalid application status.");
  }

  const applicationObjectId = new ObjectId(toText(applicationId));
  const application = await db.collection("applications").findOne({
    _id: applicationObjectId,
  });

  if (!application) {
    throw new Error("Application was not found.");
  }

  const jobId = toText(application.jobId || application.jobInfo?.id);

  if (!ObjectId.isValid(jobId)) {
    throw new Error("The application has an invalid job id.");
  }

  const job = await db.collection("jobs").findOne({
    _id: new ObjectId(jobId),
  });

  if (!job || getJobOwnerId(job) !== recruiter.id) {
    throw new Error("You can only update applications for your own jobs.");
  }

  const currentStatus = toText(application.status).toLowerCase();
  const canMoveToInterview =
    ["applied", "submitted", "review"].includes(currentStatus) &&
    nextStatus === "interview";
  const canRejectBeforeInterview =
    ["applied", "submitted", "review"].includes(currentStatus) &&
    nextStatus === "rejected";
  const canFinishInterview =
    currentStatus === "interview" &&
    ["hired", "rejected"].includes(nextStatus);

  if (!canMoveToInterview && !canRejectBeforeInterview && !canFinishInterview) {
    throw new Error("This status change is not allowed.");
  }

  await db.collection("applications").updateOne(
    { _id: applicationObjectId },
    {
      $set: {
        status: nextStatus,
        updatedAt: new Date(),
      },
    }
  );

  const updatedApplication = await db.collection("applications").findOne({
    _id: applicationObjectId,
  });

  revalidatePath("/dashboard/recruiter/jobs");
  revalidatePath("/dashboard/seeker/applications");

  return {
    message: "Application status updated successfully.",
    application: makeDocumentSafe(updatedApplication),
  };
}
