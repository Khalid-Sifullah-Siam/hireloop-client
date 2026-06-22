import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getBackendAuthHeaders } from "@/lib/server-auth-token";

async function getCurrentUser() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    return session?.user || null;
}

async function getSecureFetchHeaders() {
    const user = await getCurrentUser();

    if (!user) {
        return {};
    }

    return getBackendAuthHeaders(user);
}

const formatDate = (dateValue) => {
    if (!dateValue) {
        return "N/A";
    }

    if (typeof dateValue === "string") {
        return dateValue.slice(0, 10);
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "N/A";
    }

    return date.toISOString().slice(0, 10);
};

const getJobStatus = (job) => {
    const status = String(job.status || "").trim().toLowerCase();
    const deadlineValue = job.deadline || job.applicationDeadline;

    if (deadlineValue) {
        const deadlineDate = new Date(deadlineValue);

        if (!Number.isNaN(deadlineDate.getTime()) && deadlineDate.getTime() < Date.now()) {
            return "expired";
        }
    }

    if (status === "active") {
        return "pending";
    }

    if (status === "approved" || status === "pending" || status === "rejected" || status === "expired") {
        return status;
    }

    return "pending";
};

const getSalaryText = (job) => {
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
};

const makeJobForTable = (job) => {
    const status = getJobStatus(job);

    return {
        _id: job._id.toString(),
        title: job.jobTitle?.trim() || job.title || "Untitled job",
        companyId: job.companyId || job.company?.id || "",
        companyName: job.companyName || job.company?.name || "N/A",
        companyWebsite: job.companyWebsite || job.company?.websiteUrl || "",
        companyPlan: job.companyPlan || job.company?.plan || "N/A",
        category: job.category || "N/A",
        jobType: job.jobType || "N/A",
        status,
        location: job.location || (job.isRemote ? "Remote" : "N/A"),
        isRemote: Boolean(job.isRemote),
        currency: job.currency || job.salary?.currency || "",
        minSalary: job.minSalary ?? job.salary?.min ?? "",
        maxSalary: job.maxSalary ?? job.salary?.max ?? "",
        salaryText: getSalaryText(job),
        deadlineText: formatDate(job.deadline || job.applicationDeadline),
        deadline: job.deadline || job.applicationDeadline || "",
        createdAtText: formatDate(job.createdAt),
        responsibilities: job.responsibilities || "",
        requirements: job.requirements || "",
        benefits: job.benefits || "",
    };
};

const makeJobDetail = (job) => {
    const status = getJobStatus(job);
    const companyId = job.companyId || job.company?.id || "";

    return {
        _id: job._id.toString(),
        title: job.jobTitle?.trim() || job.title || "Untitled job",
        companyId,
        companyName: job.companyName || job.company?.name || "N/A",
        companyLogo: job.companyLogo || job.company?.logo || "",
        companyWebsite: job.companyWebsite || job.company?.websiteUrl || "",
        companyPlan: job.companyPlan || job.company?.plan || "N/A",
        category: job.category || "N/A",
        jobType: job.jobType || "N/A",
        status,
        visibility: job.visibility || "N/A",
        location: job.location || (job.isRemote ? "Remote" : "N/A"),
        isRemote: Boolean(job.isRemote),
        currency: job.currency || job.salary?.currency || "",
        minSalary: job.minSalary ?? job.salary?.min ?? null,
        maxSalary: job.maxSalary ?? job.salary?.max ?? null,
        salaryText: getSalaryText(job),
        deadlineText: formatDate(job.deadline || job.applicationDeadline),
        createdAtText: formatDate(job.createdAt),
        updatedAtText: formatDate(job.updatedAt),
        responsibilities: job.responsibilities || "",
        requirements: job.requirements || "",
        benefits: job.benefits || "",
        deadline: job.deadline || job.applicationDeadline || "",
        createdAt: job.createdAt || "",
    };
};

export const getCompanyJobs = async (companyId, status = "active") => {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

    if (!serverUrl) {
        throw new Error("NEXT_PUBLIC_SERVER_URL is missing from your environment variables.");
    }

    const response = await fetch(`${serverUrl}/jobs/${companyId}/${status}`, {
        cache: "no-store",
        headers: await getSecureFetchHeaders(),
    });

    if (!response.ok) {
        return [];
    }

    const jobs = await response.json();

    return jobs.map(makeJobForTable);
};

export const getRecruiterJobs = async (recruiterId, status = "all") => {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

    if (!serverUrl) {
        throw new Error("NEXT_PUBLIC_SERVER_URL is missing from your environment variables.");
    }

    const response = await fetch(`${serverUrl}/jobs/recruiter/${recruiterId}/${status}`, {
        cache: "no-store",
        headers: await getSecureFetchHeaders(),
    });

    if (!response.ok) {
        return [];
    }

    const jobs = await response.json();

    return jobs.map(makeJobForTable);
};

export const getAllJobs = async () => {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

    if (!serverUrl) {
        throw new Error("NEXT_PUBLIC_SERVER_URL is missing from your environment variables.");
    }

    const response = await fetch(`${serverUrl}/alljobs`, {
        cache: "no-store",
    });

    if (!response.ok) {
        return [];
    }

    const jobs = await response.json();

    return jobs.map(makeJobForTable);
};

export const getJobById = async (jobId) => {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

    if (!serverUrl) {
        throw new Error("NEXT_PUBLIC_SERVER_URL is missing from your environment variables.");
    }

    if (!jobId) {
        return null;
    }

    const response = await fetch(`${serverUrl}/job/${jobId}`, {
        cache: "no-store",
    });

    if (response.ok) {
        const job = await response.json();

        return makeJobDetail(job);
    }

    const allJobsResponse = await fetch(`${serverUrl}/alljobs`, {
        cache: "no-store",
    });

    if (!allJobsResponse.ok) {
        return null;
    }

    const jobs = await allJobsResponse.json();
    const matchedJob = jobs.find((job) => job._id?.toString() === jobId);

    return matchedJob ? makeJobDetail(matchedJob) : null;
};
