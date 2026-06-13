'use server';

import { headers } from "next/headers";
import { auth } from "@/lib/auth";

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
