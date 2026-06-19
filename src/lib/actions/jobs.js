'use server';

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getRecruiterJobs } from "@/lib/api/jobs";
import { getRecruiterJobLimit } from "@/lib/plan-utils";
import { getFreshUserPlanStatus } from "@/lib/user-plan-server";

const toBoolean = (value) => value === true || value === "true" || value === "on";

const getJobsApiUrl = () => {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

    if (!serverUrl) {
        throw new Error("NEXT_PUBLIC_SERVER_URL is missing from your environment variables.");
    }

    return `${serverUrl}/jobs`;
};

const getCurrentRecruiter = async () => {
    const requestHeaders = await headers();
    const session = await auth.api.getSession({
        headers: requestHeaders,
    });

    if (!session?.user || session.user.role !== "recruiter") {
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

const getJobPayload = (jobFormData) => {
    if (typeof FormData !== "undefined" && jobFormData instanceof FormData) {
        const payload = Object.fromEntries(jobFormData.entries());

        return {
            ...payload,
            isRemote: toBoolean(payload.isRemote),
            companyApproved: toBoolean(payload.companyApproved),
        };
    }

    return jobFormData;
};

export async function createJob(jobFormData) {
    const payload = getJobPayload(jobFormData);
    const recruiter = await getCurrentRecruiter();

    if (!recruiter) {
        return {
            success: false,
            message: "Please sign in as a recruiter before posting a job.",
        };
    }

    const activeJobs = await getRecruiterJobs(recruiter.id);
    const planStatus = await getFreshUserPlanStatus(recruiter, "recruiter_free");
    const jobLimit = getRecruiterJobLimit(planStatus.plan);

    if (activeJobs.length >= jobLimit) {
        return {
            success: false,
            message: planStatus.isExpired
                ? "Your paid plan expired after 30 days. Please upgrade again to post more jobs."
                : "Your current recruiter plan has reached its active job post limit.",
        };
    }

    if (!payload.companyApproved) {
        return {
            success: false,
            message: "Please wait to get approval.",
        };
    }

    const res = await fetch(getJobsApiUrl(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ...payload,
            recruiterId: recruiter.id,
        })
    });

    const data = await parseResponse(res);

    return {
        ...data,
        success: res.ok,
        message: data?.message || (res.ok ? "Job posted successfully." : "Failed to post job."),
    };
}

export async function getCurrentRecruiterPlanStatus() {
    const recruiter = await getCurrentRecruiter();

    if (!recruiter) {
        return {
            plan: "recruiter_free",
            planExpiresAt: null,
            isExpired: false,
        };
    }

    return getFreshUserPlanStatus(recruiter, "recruiter_free");
}
