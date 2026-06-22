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

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "N/A";
    }

    return date.toISOString().slice(0, 10);
};

const makeSavedJob = (savedJob) => {
    const jobInfo = savedJob.jobInfo || {};
    const jobId = jobInfo.id || savedJob.jobId || "";

    return {
        _id: savedJob._id?.toString(),
        jobId,
        savedAt: savedJob.savedAt || savedJob.createdAt || null,
        savedAtText: formatDate(savedJob.savedAt || savedJob.createdAt),
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
};

export const getSeekerSavedJobs = async (seekerId, seekerEmail = "") => {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

    if (!serverUrl) {
        throw new Error("NEXT_PUBLIC_SERVER_URL is missing from your environment variables.");
    }

    if (!seekerId) {
        return [];
    }

    const searchParams = new URLSearchParams();

    if (seekerEmail) {
        searchParams.set("email", seekerEmail);
    }

    const queryString = searchParams.toString();
    const apiUrl = `${serverUrl}/saved-jobs/seeker/${seekerId}${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(apiUrl, {
        cache: "no-store",
        headers: await getSecureFetchHeaders(),
    });

    if (!response.ok) {
        return [];
    }

    const savedJobs = await response.json();

    return savedJobs.map(makeSavedJob);
};
