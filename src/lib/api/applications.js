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

const makeApplication = (application) => {
    return {
        _id: application._id?.toString(),
        status: application.status || "submitted",
        appliedAt: application.appliedAt || application.createdAt || null,
        appliedAtText: formatDate(application.appliedAt || application.createdAt),
        userInfo: application.userInfo || {},
        jobInfo: application.jobInfo || {},
        applicationInfo: application.applicationInfo || {},
    };
};

export const getSeekerApplications = async (seekerId, seekerEmail = "") => {
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
    const apiUrl = `${serverUrl}/applications/seeker/${seekerId}${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(apiUrl, {
        cache: "no-store",
        headers: await getSecureFetchHeaders(),
    });

    if (!response.ok) {
        return [];
    }

    const applications = await response.json();

    return applications.map(makeApplication);
};
