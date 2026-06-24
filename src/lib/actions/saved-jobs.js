'use server';

import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  db,
  getCurrentActiveUserWithRole,
  toText,
} from "@/lib/database-helpers";

export async function saveJob(formData) {
  const jobId = toText(formData.get("jobId"));
  const seeker = await getCurrentActiveUserWithRole("seeker");

  if (!seeker) {
    redirect(`/auth/signin?redirect=/jobs/${jobId}`);
  }

  if (!ObjectId.isValid(jobId)) {
    redirect("/jobs?error=Invalid job id");
  }

  const oldApplication = await db.collection("applications").findOne({
    seekerId: seeker.id,
    jobId,
  });

  if (oldApplication) {
    redirect(`/jobs/${jobId}?error=You already applied for this job`);
  }

  const job = await db.collection("jobs").findOne({
    _id: new ObjectId(jobId),
    status: { $regex: /^approved$/i },
  });

  if (!job) {
    redirect(`/jobs/${jobId}?error=Job not found`);
  }

  const now = new Date();
  const savedJob = {
    seekerId: seeker.id,
    seekerEmail: seeker.email || "",
    jobId,
    jobInfo: {
      id: jobId,
      title: job.jobTitle || job.title || "Untitled job",
      companyName: job.companyName || job.company?.name || "N/A",
      category: job.category || "N/A",
      jobType: job.jobType || "N/A",
      location: job.location || (job.isRemote ? "Remote" : "N/A"),
      deadline: job.deadline || job.applicationDeadline || null,
    },
    savedAt: now,
    updatedAt: now,
  };

  await db.collection("savedJobs").updateOne(
    { seekerId: seeker.id, jobId },
    {
      $set: savedJob,
      $setOnInsert: { createdAt: now },
    },
    { upsert: true }
  );

  revalidatePath(`/jobs/${jobId}`);
  revalidatePath(`/job/${jobId}`);
  revalidatePath("/dashboard/seeker/saved-jobs");
  redirect(`/jobs/${jobId}?success=Job saved successfully`);
}

export async function removeSavedJob(formData) {
  const seeker = await getCurrentActiveUserWithRole("seeker");
  const jobId = toText(formData.get("jobId"));
  const returnTo = toText(formData.get("returnTo")) || "/dashboard/seeker/saved-jobs";

  if (!seeker) {
    redirect("/auth/signin");
  }

  await db.collection("savedJobs").deleteMany({
    seekerId: seeker.id,
    $or: [
      { jobId },
      { "jobInfo.id": jobId },
    ],
  });

  revalidatePath(`/jobs/${jobId}`);
  revalidatePath(`/job/${jobId}`);
  revalidatePath("/dashboard/seeker/saved-jobs");
  redirect(returnTo);
}
