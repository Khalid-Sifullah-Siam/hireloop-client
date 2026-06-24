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

function makeSavedJob(savedJob) {
  const safeSavedJob = makeDocumentSafe(savedJob);
  const jobInfo = safeSavedJob.jobInfo || {};
  const jobId = jobInfo.id || safeSavedJob.jobId || "";

  return {
    _id: safeSavedJob._id,
    jobId,
    savedAt: safeSavedJob.savedAt || safeSavedJob.createdAt || null,
    savedAtText: formatDate(safeSavedJob.savedAt || safeSavedJob.createdAt),
    jobInfo: {
      ...jobInfo,
      id: jobId,
      title: jobInfo.title || "Untitled job",
      companyName: jobInfo.companyName || "N/A",
      jobType: jobInfo.jobType || "Full-time",
      location: jobInfo.location || "",
      deadlineText: formatDate(jobInfo.deadline),
    },
  };
}

export async function getSeekerSavedJobs(seekerId, seekerEmail = "") {
  const user = await getCurrentUser();

  if (
    !user ||
    user.role !== "seeker" ||
    toText(user.id) !== toText(seekerId)
  ) {
    return [];
  }

  const filters = [{ seekerId: toText(seekerId) }];
  const email = toText(seekerEmail || user.email).toLowerCase();

  if (email) {
    filters.push({ seekerEmail: email });
  }

  const savedJobs = await db.collection("savedJobs").find({
    $or: filters,
  }).sort({
    savedAt: -1,
    _id: -1,
  }).toArray();

  return savedJobs.map(makeSavedJob);
}
