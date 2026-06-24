import { ObjectId } from "mongodb";
import {
  db,
  getCurrentUser,
  makeDocumentSafe,
  toText,
} from "@/lib/database-helpers";

function formatDate(dateValue) {
  if (!dateValue) {
    return "N/A";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return date.toISOString().slice(0, 10);
}

function makeApplication(application) {
  const safeApplication = makeDocumentSafe(application);
  const jobInfo = safeApplication.jobInfo || {};
  const jobId =
    jobInfo.id ||
    safeApplication.jobId ||
    safeApplication.job_id ||
    "";

  return {
    _id: safeApplication._id,
    status: safeApplication.status || "submitted",
    appliedAt: safeApplication.appliedAt || safeApplication.createdAt || null,
    appliedAtText: formatDate(safeApplication.appliedAt || safeApplication.createdAt),
    userInfo: safeApplication.userInfo || {},
    jobInfo: {
      ...jobInfo,
      id: jobId,
      title: jobInfo.title || safeApplication.jobTitle || "Untitled job",
      companyName: jobInfo.companyName || safeApplication.companyName || "N/A",
      jobType: jobInfo.jobType || safeApplication.jobType || "Full-time",
      location: jobInfo.location || safeApplication.location || "",
    },
    applicationInfo: safeApplication.applicationInfo || {},
  };
}

export async function getSeekerApplications(seekerId, seekerEmail = "") {
  const user = await getCurrentUser();

  if (
    !user ||
    user.role !== "seeker" ||
    toText(user.id) !== toText(seekerId)
  ) {
    return [];
  }

  const filters = [
    { seekerId: toText(seekerId) },
    { "userInfo.id": toText(seekerId) },
  ];
  const email = toText(seekerEmail || user.email).toLowerCase();

  if (email) {
    filters.push({ "userInfo.email": email });
    filters.push({ "applicationInfo.email": email });
  }

  const applications = await db.collection("applications").find({
    $or: filters,
  }).sort({
    appliedAt: -1,
    _id: -1,
  }).toArray();

  return applications.map(makeApplication);
}

export async function getRecruiterJobApplications(jobId) {
  const recruiter = await getCurrentUser();

  if (
    !recruiter ||
    recruiter.role !== "recruiter" ||
    !ObjectId.isValid(toText(jobId))
  ) {
    return [];
  }

  const job = await db.collection("jobs").findOne({
    _id: new ObjectId(toText(jobId)),
  });
  const ownerId = toText(job?.recruiterId || job?.company?.recruiterId);

  if (!job || ownerId !== toText(recruiter.id)) {
    return [];
  }

  const applications = await db.collection("applications").find({
    $or: [
      { jobId: toText(jobId) },
      { "jobInfo.id": toText(jobId) },
    ],
  }).sort({
    appliedAt: -1,
    _id: -1,
  }).toArray();

  return applications.map(makeApplication);
}
