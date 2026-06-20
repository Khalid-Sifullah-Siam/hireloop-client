'use server';

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getSeekerApplications } from "@/lib/api/applications";
import { getSeekerApplicationLimit } from "@/lib/plan-utils";
import { getFreshUserPlan } from "@/lib/user-plan-server";
import { getBackendJsonHeaders } from "@/lib/server-auth-token";

const getApplicationsApiUrl = () => {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

    if (!serverUrl) {
        throw new Error("NEXT_PUBLIC_SERVER_URL is missing from your environment variables.");
    }

    return `${serverUrl}/applications`;
};

const getCurrentSeeker = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user || session.user.role !== "seeker") {
        return null;
    }

    return session.user;
};

const parseResponse = async (response) => {
    try {
        return await response.json();
    } catch {
        return {};
    }
};

export async function applyForJob(formData) {
    const seeker = await getCurrentSeeker();

    if (!seeker) {
        redirect("/auth/signin");
    }

    const currentPlan = await getFreshUserPlan(seeker, "seeker_free");
    const applications = await getSeekerApplications(seeker.id, seeker.email);
    const applicationLimit = getSeekerApplicationLimit(currentPlan);

    if (applications.length >= applicationLimit) {
        redirect("/plans?error=Your current plan has reached its monthly application limit");
    }

    const payload = Object.fromEntries(formData.entries());
    const applicationData = {
        ...payload,
        seekerId: seeker.id,
        userInfo: {
            id: seeker.id,
            name: payload.fullName || seeker.name || "",
            email: payload.email || seeker.email || "",
        },
        jobInfo: {
            id: payload.jobId || "",
            title: payload.jobTitle || "",
            companyName: payload.companyName || "",
            location: payload.location || "",
        },
        applicationInfo: {
            resumeLink: payload.resumeLink || "",
            portfolioLink: payload.portfolioLink || "",
            message: payload.message || "",
        },
    };

    const response = await fetch(getApplicationsApiUrl(), {
        method: "POST",
        headers: getBackendJsonHeaders(seeker),
        body: JSON.stringify(applicationData),
    });

    const data = await parseResponse(response);

    if (!response.ok) {
        const message = data?.message || "Failed to submit application.";
        redirect(`/dashboard/seeker/applications?error=${encodeURIComponent(message)}`);
    }

    redirect("/dashboard/seeker/applications?success=Application submitted successfully");
}
