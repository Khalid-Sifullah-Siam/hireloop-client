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

function getJobStatus(job) {
  const status = toText(job.status).toLowerCase();
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

  if (status === "active") {
    return "approved";
  }

  if (status === "approved" || status === "expired") {
    return status;
  }

  return "pending";
}

function getSalaryText(job) {
  const currency = job.currency || job.salary?.currency || "";
  const minSalary = job.minSalary ?? job.salary?.min;
  const maxSalary = job.maxSalary ?? job.salary?.max;
  const hasMinSalary = minSalary !== undefined && minSalary !== null && minSalary !== "";
  const hasMaxSalary = maxSalary !== undefined && maxSalary !== null && maxSalary !== "";

  if (!hasMinSalary && !hasMaxSalary) {
    return "N/A";
  }

  const salaryRange = `${hasMinSalary ? minSalary : "N/A"} - ${hasMaxSalary ? maxSalary : "N/A"}`;

  return currency ? `${currency} ${salaryRange}` : salaryRange;
}

function getVisibleJobData(job, showPendingUpdate) {
  if (!showPendingUpdate || !job.pendingUpdate) {
    return job;
  }

  return {
    ...job,
    ...job.pendingUpdate,
    _id: job._id,
    status: job.status,
  };
}

function makeJobForTable(job) {
  const safeJob = makeDocumentSafe(job);

  return {
    _id: safeJob._id,
    title: toText(safeJob.jobTitle) || safeJob.title || "Untitled job",
    companyId: safeJob.companyId || safeJob.company?.id || "",
    companyName: safeJob.companyName || safeJob.company?.name || "N/A",
    companyLogo: safeJob.companyLogo || safeJob.company?.logo || "",
    companyWebsite: safeJob.companyWebsite || safeJob.company?.websiteUrl || "",
    companyPlan: safeJob.companyPlan || safeJob.company?.plan || "N/A",
    category: safeJob.category || "N/A",
    jobType: safeJob.jobType || "N/A",
    status: getJobStatus(safeJob),
    location: safeJob.location || (safeJob.isRemote ? "Remote" : "N/A"),
    isRemote: Boolean(safeJob.isRemote),
    currency: safeJob.currency || safeJob.salary?.currency || "",
    minSalary: safeJob.minSalary ?? safeJob.salary?.min ?? "",
    maxSalary: safeJob.maxSalary ?? safeJob.salary?.max ?? "",
    salaryText: getSalaryText(safeJob),
    deadlineText: formatDate(safeJob.deadline || safeJob.applicationDeadline),
    deadline: safeJob.deadline || safeJob.applicationDeadline || "",
    createdAtText: formatDate(safeJob.createdAt),
    createdAt: safeJob.createdAt || "",
    responsibilities: safeJob.responsibilities || "",
    requirements: safeJob.requirements || "",
    benefits: safeJob.benefits || "",
  };
}

function makeJobDetail(job) {
  const tableJob = makeJobForTable(job);
  const safeJob = makeDocumentSafe(job);

  return {
    ...tableJob,
    visibility: safeJob.visibility || "public",
    updatedAtText: formatDate(safeJob.updatedAt),
  };
}

function publicJobFilter() {
  return {
    $or: [
      { status: { $regex: /^approved$/i } },
      { status: { $regex: /^active$/i } },
      { status: { $exists: false } },
      { status: null },
      { status: "" },
    ],
  };
}

export async function getCompanyJobs(companyId, status = "all") {
  const recruiter = await getCurrentUser();

  if (!recruiter || recruiter.role !== "recruiter" || !companyId) {
    return [];
  }

  const query = {
    $and: [
      {
        $or: [
          { companyId: toText(companyId) },
          { "company.id": toText(companyId) },
        ],
      },
      {
        $or: [
          { recruiterId: recruiter.id },
          { "company.recruiterId": recruiter.id },
        ],
      },
    ],
  };

  if (status && status !== "all") {
    query.status = status === "active" ? "approved" : status;
  }

  const jobs = await db.collection("jobs").find(query).sort({
    createdAt: -1,
    _id: -1,
  }).toArray();

  return jobs.map((job) => makeJobForTable(getVisibleJobData(job, true)));
}

export async function getRecruiterJobs(recruiterId, status = "all") {
  const recruiter = await getCurrentUser();

  if (
    !recruiter ||
    recruiter.role !== "recruiter" ||
    toText(recruiter.id) !== toText(recruiterId)
  ) {
    return [];
  }

  const query = {
    $or: [
      { recruiterId: recruiter.id },
      { "company.recruiterId": recruiter.id },
    ],
  };

  if (status && status !== "all") {
    query.status = status;
  }

  const jobs = await db.collection("jobs").find(query).sort({
    createdAt: -1,
    _id: -1,
  }).toArray();

  return jobs.map((job) => makeJobForTable(getVisibleJobData(job, true)));
}

export async function getAllJobs() {
  const jobs = await db.collection("jobs").find(publicJobFilter()).sort({
    createdAt: -1,
    _id: -1,
  }).toArray();

  return jobs.map(makeJobForTable);
}

export async function getJobById(jobId) {
  if (!ObjectId.isValid(toText(jobId))) {
    return null;
  }

  const job = await db.collection("jobs").findOne({
    _id: new ObjectId(toText(jobId)),
  });

  if (!job) {
    return null;
  }

  const user = await getCurrentUser();
  const ownerId = toText(job.recruiterId || job.company?.recruiterId);
  const isOwner = user?.role === "recruiter" && toText(user.id) === ownerId;
  const isAdmin = user?.role === "admin";
  const status = toText(job.status).toLowerCase();
  const isPublic =
    !status ||
    status === "approved" ||
    status === "active";

  if (!isPublic && !isOwner && !isAdmin) {
    return null;
  }

  return makeJobDetail(getVisibleJobData(job, isOwner || isAdmin));
}
