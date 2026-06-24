'use server';

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import {
  db,
  getCurrentUserWithRole,
  makeDocumentSafe,
} from "@/lib/database-helpers";

function getJobStatus(job) {
  const status = String(job.status || "").trim().toLowerCase();
  const deadlineValue = job.deadline || job.applicationDeadline;

  if (status === "pending" || status === "rejected") {
    return status;
  }

  if (deadlineValue) {
    const deadlineDate = new Date(deadlineValue);

    if (!Number.isNaN(deadlineDate.getTime()) && deadlineDate.getTime() < Date.now()) {
      return "expired";
    }
  }

  if (status === "approved" || status === "expired") {
    return status;
  }

  return status || "pending";
}

function getAdminJobData(job) {
  if (!job.pendingUpdate) {
    return job;
  }

  return {
    ...job,
    ...job.pendingUpdate,
    _id: job._id,
    status: job.status,
    isPendingUpdate: true,
  };
}

export async function getAdminJobs(status = "all") {
  const admin = await getCurrentUserWithRole("admin");

  if (!admin) {
    return [];
  }

  const jobs = await db
    .collection("jobs")
    .find({})
    .sort({ createdAt: -1, _id: -1 })
    .toArray();
  const users = await db
    .collection("user")
    .find({})
    .project({ id: 1, email: 1 })
    .toArray();
  const emailByUserId = new Map();

  for (const user of users) {
    emailByUserId.set(user._id.toString(), user.email || "");

    if (user.id) {
      emailByUserId.set(String(user.id), user.email || "");
    }
  }

  const normalizedJobs = jobs.map((job) => {
    const adminJob = getAdminJobData(job);

    return {
      ...makeDocumentSafe(adminJob),
      status: getJobStatus(job),
      recruiterEmail:
        emailByUserId.get(String(job.recruiterId || job.company?.recruiterId || "")) || "N/A",
    };
  });

  if (status && status !== "all") {
    return normalizedJobs.filter((job) => job.status === status);
  }

  return normalizedJobs;
}

export async function getAdminJobStats() {
  const jobs = await getAdminJobs("all");

  return {
    pendingCount: jobs.filter((job) => job.status === "pending").length,
    approvedCount: jobs.filter((job) => job.status === "approved").length,
    rejectedCount: jobs.filter((job) => job.status === "rejected").length,
    expiredCount: jobs.filter((job) => job.status === "expired").length,
  };
}

export async function updateAdminJobStatus(formData) {
  const admin = await getCurrentUserWithRole("admin");

  if (!admin) {
    throw new Error("Only admins can update job status.");
  }

  const jobId = String(formData.get("jobId") || "").trim();
  const status = String(formData.get("status") || "").trim().toLowerCase();

  if (!ObjectId.isValid(jobId) || !status) {
    throw new Error("Job id and status are required.");
  }

  if (!["pending", "approved", "rejected"].includes(status)) {
    throw new Error("Invalid job status.");
  }

  const jobObjectId = new ObjectId(jobId);
  const existingJob = await db.collection("jobs").findOne({
    _id: jobObjectId,
  });

  if (!existingJob) {
    throw new Error("Job was not found.");
  }

  if (existingJob.pendingUpdate && status === "approved") {
    await db.collection("jobs").updateOne(
      { _id: jobObjectId },
      {
        $set: {
          ...existingJob.pendingUpdate,
          status: "approved",
          createdAt: existingJob.createdAt || existingJob.pendingUpdate.createdAt,
          updatedAt: new Date(),
        },
        $unset: {
          pendingUpdate: "",
          previousStatus: "",
        },
      }
    );
  } else if (existingJob.pendingUpdate && status === "rejected") {
    await db.collection("jobs").updateOne(
      { _id: jobObjectId },
      {
        $set: {
          status: existingJob.previousStatus || "approved",
          updatedAt: new Date(),
        },
        $unset: {
          pendingUpdate: "",
          previousStatus: "",
        },
      }
    );
  } else {
    await db.collection("jobs").updateOne(
      { _id: jobObjectId },
      {
        $set: {
          status,
          updatedAt: new Date(),
        },
      }
    );
  }

  const updatedJob = await db.collection("jobs").findOne({ _id: jobObjectId });

  revalidatePath("/dashboard/admin/jobs");
  revalidatePath("/dashboard/recruiter/jobs");
  revalidatePath("/jobs");
  revalidatePath(`/jobs/${jobId}`);
  revalidatePath(`/job/${jobId}`);

  return {
    message: "Job status updated successfully.",
    job: makeDocumentSafe(updatedJob),
  };
}
