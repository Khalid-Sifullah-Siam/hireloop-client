'use server';

import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";
import {
  db,
  getCurrentActiveUserWithRole,
  toText,
} from "@/lib/database-helpers";
import { getSeekerApplicationLimit } from "@/lib/plan-utils";
import { getFreshUserPlan } from "@/lib/user-plan-server";

export async function applyForJob(formData) {
  const seeker = await getCurrentActiveUserWithRole("seeker");

  if (!seeker) {
    redirect("/auth/signin");
  }

  const jobId = toText(formData.get("jobId"));
  const fullName = toText(formData.get("fullName"));
  const email = toText(formData.get("email")).toLowerCase();
  const resumeLink = toText(formData.get("resumeLink"));

  if (!ObjectId.isValid(jobId)) {
    redirect("/jobs?error=Invalid job id");
  }

  if (!fullName || !email || !resumeLink) {
    redirect(`/job/${jobId}/apply?error=Please fill in all required fields`);
  }

  const job = await db.collection("jobs").findOne({
    _id: new ObjectId(jobId),
    status: { $regex: /^approved$/i },
  });

  if (!job) {
    redirect(`/jobs/${jobId}?error=This job is not available`);
  }

  const deadline = new Date(job.deadline || job.applicationDeadline || "");

  if (!Number.isNaN(deadline.getTime()) && deadline.getTime() < Date.now()) {
    redirect(`/jobs/${jobId}?error=This job has expired`);
  }

  const oldApplication = await db.collection("applications").findOne({
    seekerId: seeker.id,
    jobId,
  });

  if (oldApplication) {
    redirect(`/dashboard/seeker/applications?error=You already applied for this job`);
  }

  const currentPlan = await getFreshUserPlan(seeker, "seeker_free");
  const applicationLimit = getSeekerApplicationLimit(currentPlan);
  const applicationCount = await db.collection("applications").countDocuments({
    seekerId: seeker.id,
  });

  if (applicationCount >= applicationLimit) {
    redirect("/plans?error=Your current plan has reached its application limit");
  }

  const now = new Date();
  const application = {
    seekerId: seeker.id,
    jobId,
    userInfo: {
      id: seeker.id,
      name: fullName,
      email,
    },
    jobInfo: {
      id: jobId,
      title: job.jobTitle || job.title || "Untitled job",
      companyName: job.companyName || job.company?.name || "N/A",
      category: job.category || "N/A",
      jobType: job.jobType || "N/A",
      location: job.location || (job.isRemote ? "Remote" : "N/A"),
    },
    applicationInfo: {
      fullName,
      email,
      resumeLink,
      portfolioLink: toText(formData.get("portfolioLink")),
      message: toText(formData.get("message")),
    },
    status: "applied",
    appliedAt: now,
    createdAt: now,
    updatedAt: now,
  };

  await Promise.all([
    db.collection("applications").insertOne(application),
    db.collection("savedJobs").deleteOne({
      seekerId: seeker.id,
      jobId,
    }),
  ]);

  redirect("/dashboard/seeker/applications?success=Application submitted successfully");
}
